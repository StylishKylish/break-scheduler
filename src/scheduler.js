/**
 * Waterfall Break Scheduler Algorithm
 *
 * Converts all times to "minutes since shift start" internally.
 * Handles overnight shifts (e.g. 18:30 to 05:00).
 *
 * Compliant with Oregon (OAR 839-020-0050) and Federal (FLSA) break laws:
 *   - Oregon: 30-min meal required when shift >= 6h
 *     - Shifts 6–7h: meal starts after hour 2, completed before hour 5
 *     - Shifts 7+h:  meal starts after hour 3, completed before hour 6
 *   - Oregon: 10-min paid rest per 4h segment (or major portion >2h01)
 *     - Rest breaks must be "approximately in the middle" of each segment
 *     - Rest breaks CANNOT be combined with or adjacent to meal periods
 *   - Minimum 30-min gap between any two breaks for the same employee
 *
 * Priority: Own-break gap > Spacing > Same-type sep > Preferred > Avoid
 */

// Convert "HH:MM" string to minutes since midnight
export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes since midnight to "HH:MM" string
export function minutesToTime(mins) {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Convert minutes since midnight to 12-hour format
export function minutesToTime12(mins) {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Format a "HH:MM" clock string based on use24h flag
export function formatTime(clockStr, use24h) {
  if (use24h) return clockStr;
  return minutesToTime12(timeToMinutes(clockStr));
}

// Get shift duration in minutes, handling overnight
export function getShiftDuration(startStr, endStr) {
  const start = timeToMinutes(startStr);
  const end = timeToMinutes(endStr);
  if (end <= start) {
    return (1440 - start) + end;
  }
  return end - start;
}

// Convert clock time to minutes-from-shift-start
export function clockToShiftMinutes(clockStr, shiftStartStr) {
  const clock = timeToMinutes(clockStr);
  const shiftStart = timeToMinutes(shiftStartStr);
  let diff = clock - shiftStart;
  if (diff < 0) diff += 1440;
  return diff;
}

// Convert minutes-from-shift-start to clock time string
export function shiftMinutesToClock(shiftMins, shiftStartStr) {
  const shiftStart = timeToMinutes(shiftStartStr);
  return minutesToTime(shiftStart + shiftMins);
}

// Oregon law: minimum gap between same-employee breaks (minutes)
const OWN_BREAK_GAP = 30;

/**
 * Oregon meal-period window for a given employee shift duration.
 * Returns { earliest, latest } in minutes from employee's shift start.
 *
 * OAR 839-020-0050:
 *   6–7h shift  → meal starts after hour 2, completed before hour 5
 *   7+h shift   → meal starts after hour 3, completed before hour 6
 */
function getMealWindow(empShiftDuration, mealDuration) {
  if (empShiftDuration < 360) {
    // Shift under 6h — no meal legally required, but allow flexible placement
    return { earliest: 120, latest: empShiftDuration - mealDuration - 15 };
  }
  if (empShiftDuration <= 420) {
    // 6–7h: after hour 2, completed before hour 5
    return { earliest: 120, latest: 300 - mealDuration };
  }
  // 7+h: after hour 3, completed before hour 6
  return { earliest: 180, latest: 360 - mealDuration };
}

/**
 * Calculate ideal rest-break midpoints given an employee's shift and scheduled meals.
 * Oregon requires rests "approximately in the middle" of each work segment.
 * Work segments are the periods between: shift start, each meal, and shift end.
 */
function getRestMidpoints(empOffset, empDuration, ownMeals) {
  // Sort meals by start time (relative to global shift)
  const meals = [...ownMeals].sort((a, b) => a.startShiftMin - b.startShiftMin);

  // Build work segments: gaps between shift start, meals, and shift end
  const segments = [];
  let cursor = empOffset;
  for (const meal of meals) {
    if (meal.startShiftMin > cursor) {
      segments.push({ start: cursor, end: meal.startShiftMin });
    }
    cursor = meal.endShiftMin;
  }
  const empEnd = empOffset + empDuration;
  if (cursor < empEnd) {
    segments.push({ start: cursor, end: empEnd });
  }

  // Return midpoint of each segment that's long enough to warrant a rest break
  // Oregon: rest per 4h segment or "major portion" (>2h01m = 121 min)
  return segments
    .filter(s => (s.end - s.start) > 121)
    .map(s => s.start + Math.floor((s.end - s.start) / 2));
}

/**
 * Schedule breaks using waterfall algorithm.
 *
 * @param {Object} config
 * @param {string} config.shiftStart - "HH:MM"
 * @param {string} config.shiftEnd - "HH:MM"
 * @param {number} config.spacingMinutes - min gap between concurrent breaks
 * @param {number} config.firstBreakDelay - min minutes before first break
 * @param {boolean} config.separateLunches - stagger lunches across employees
 * @param {boolean} config.separateRests - stagger rests across employees
 * @param {Array} config.employees - [{ id, name, shiftStart?, shiftEnd?, breaks: [{ id, type, duration }] }]
 * @param {Array} config.preferredTimes - [{ time: "HH:MM", note: string }]
 * @param {Array} config.avoidTimes - [{ start: "HH:MM", end: "HH:MM", note: string }]
 * @returns {Object} { schedule, conflicts, coverageData, shiftDuration }
 */
export function generateSchedule(config) {
  const {
    shiftStart,
    shiftEnd,
    spacingMinutes,
    firstBreakDelay = 120,
    separateLunches = true,
    separateRests = true,
    employees,
    preferredTimes = [],
    avoidTimes = [],
  } = config;

  // The "global" shift defines the overall timeline window
  const shiftDuration = getShiftDuration(shiftStart, shiftEnd);

  // Convert avoid times to shift-relative ranges (relative to global shift)
  const avoidRanges = avoidTimes.map(a => ({
    start: clockToShiftMinutes(a.start, shiftStart),
    end: clockToShiftMinutes(a.end, shiftStart),
    note: a.note,
  }));

  // Convert preferred times to shift-relative (relative to global shift)
  const preferredMinutes = preferredTimes.map(p =>
    clockToShiftMinutes(p.time, shiftStart)
  );

  // Build a flat list of all breaks that need scheduling.
  //
  // Phase ordering is GLOBAL across all employees:
  //   Phase 1: every employee's FIRST rest break
  //   Phase 2: every employee's lunch break(s)
  //   Phase 3: every employee's remaining rest breaks
  //
  // This guarantees that by the time any lunch is scheduled, every employee's
  // first rest is already placed — so the 30-min own-break gap constraint
  // naturally forces lunch to land after the first rest.
  const phase1 = []; // first rest for each employee
  const phase2 = []; // lunches for each employee
  const phase3 = []; // remaining rests for each employee

  for (const emp of employees) {
    const empStart = emp.shiftStart || shiftStart;
    const empEnd = emp.shiftEnd || shiftEnd;
    const empDuration = getShiftDuration(empStart, empEnd);
    const empOffsetFromGlobal = clockToShiftMinutes(empStart, shiftStart);

    const makeEntry = brk => ({
      employeeId: emp.id,
      employeeName: emp.name,
      breakId: brk.id,
      type: brk.type,
      duration: brk.duration,
      empShiftStart: empStart,
      empShiftDuration: empDuration,
      empOffsetFromGlobal,
    });

    const rests = emp.breaks.filter(b => b.type === 'rest');
    const lunches = emp.breaks.filter(b => b.type === 'lunch');

    if (rests.length > 0) phase1.push(makeEntry(rests[0]));
    lunches.forEach(l => phase2.push(makeEntry(l)));
    rests.slice(1).forEach(r => phase3.push(makeEntry(r)));
  }

  const allBreaks = [...phase1, ...phase2, ...phase3];

  // Scheduled breaks: { employeeId, breakId, type, duration, startShiftMin, endShiftMin }
  // All startShiftMin/endShiftMin are relative to the GLOBAL shift start
  const scheduled = [];
  const conflicts = [];

  // For each break, find optimal placement
  for (const brk of allBreaks) {
    const { employeeId, type, duration, empShiftDuration, empOffsetFromGlobal } = brk;

    // Determine the valid window for this break (in global shift minutes)
    // Employee can only take breaks during their own shift
    let windowStart = empOffsetFromGlobal + firstBreakDelay;
    let windowEnd = empOffsetFromGlobal + empShiftDuration - duration - 15;

    // Oregon meal-period timing windows (OAR 839-020-0050)
    if (type === 'lunch') {
      const mealWindow = getMealWindow(empShiftDuration, duration);
      windowStart = Math.max(windowStart, empOffsetFromGlobal + mealWindow.earliest);
      windowEnd = Math.min(windowEnd, empOffsetFromGlobal + mealWindow.latest);

      // Lunch must come AFTER the employee's first rest break.
      // The Phase 1 rest is already scheduled; push windowStart past it + gap.
      const alreadyScheduledRests = scheduled.filter(
        s => s.employeeId === employeeId && s.type === 'rest'
      );
      if (alreadyScheduledRests.length > 0) {
        const latestRestEnd = Math.max(...alreadyScheduledRests.map(s => s.endShiftMin));
        windowStart = Math.max(windowStart, latestRestEnd + OWN_BREAK_GAP);
      }
    }

    // Fallback: if window is impossible, relax to fit within shift
    if (windowStart >= windowEnd) {
      windowStart = empOffsetFromGlobal + Math.min(firstBreakDelay, 30);
      windowEnd = empOffsetFromGlobal + empShiftDuration - duration - 15;
    }

    // Clamp to global shift bounds
    windowStart = Math.max(0, windowStart);
    windowEnd = Math.min(shiftDuration - duration, windowEnd);

    // Get existing breaks for this employee
    const ownBreaks = scheduled.filter(s => s.employeeId === employeeId);

    // For rest breaks: compute ideal midpoints of work segments (Oregon law).
    // Only applies when a meal is already scheduled — the pre-lunch first rest
    // has no meal yet, so we skip midpoint targeting to keep it early in the shift.
    let restMidpoints = [];
    if (type === 'rest') {
      const ownMeals = ownBreaks.filter(s => s.type === 'lunch');
      if (ownMeals.length > 0) {
        restMidpoints = getRestMidpoints(empOffsetFromGlobal, empShiftDuration, ownMeals);
      }
    }

    // Score each possible minute slot
    let bestSlot = windowStart;
    let bestScore = -Infinity;

    for (let t = windowStart; t <= windowEnd; t++) {
      const breakEnd = t + duration;
      let score = 0;

      // ── Hard constraint: no overlap with own breaks ──
      const overlapsOwn = ownBreaks.some(ob =>
        t < ob.endShiftMin && breakEnd > ob.startShiftMin
      );
      if (overlapsOwn) continue;

      // ── Hard constraint: 30-min gap between same-employee breaks ──
      // Oregon: rest breaks cannot be combined with meals; implicit from midpoint rule
      const tooCloseToOwn = ownBreaks.some(ob => {
        const gapAfter = t - ob.endShiftMin;   // gap between ob's end and this start
        const gapBefore = ob.startShiftMin - breakEnd; // gap between this end and ob's start
        const closestGap = Math.max(gapAfter, gapBefore);
        return closestGap < OWN_BREAK_GAP;
      });
      if (tooCloseToOwn) continue;

      // ── Spacing constraint: gap between different employees' breaks ──
      const otherBreaks = scheduled.filter(s => s.employeeId !== employeeId);
      for (const ob of otherBreaks) {
        const gap = Math.max(0, Math.max(t - ob.endShiftMin, ob.startShiftMin - breakEnd));
        if (gap < spacingMinutes && !(t >= ob.endShiftMin + spacingMinutes || breakEnd <= ob.startShiftMin - spacingMinutes)) {
          if (t < ob.endShiftMin && breakEnd > ob.startShiftMin) {
            score -= 10000;
          } else if (gap < spacingMinutes) {
            score -= 5000 * (1 - gap / spacingMinutes);
          }
        }

        // Same-type separation: extra penalty for lunch-lunch or rest-rest clustering
        const sameType = ob.type === type;
        if (sameType) {
          if (type === 'lunch' && separateLunches) {
            if (t < ob.endShiftMin && breakEnd > ob.startShiftMin) {
              score -= 20000;
            } else if (gap < spacingMinutes) {
              score -= 8000 * (1 - gap / spacingMinutes);
            }
          }
          if (type === 'rest' && separateRests) {
            if (t < ob.endShiftMin && breakEnd > ob.startShiftMin) {
              score -= 20000;
            } else if (gap < spacingMinutes) {
              score -= 8000 * (1 - gap / spacingMinutes);
            }
          }
        }
      }

      // ── Oregon rest midpoint targeting ──
      // Rest breaks should be near the middle of their work segment
      if (type === 'rest' && restMidpoints.length > 0) {
        let closestDist = Infinity;
        for (const mid of restMidpoints) {
          closestDist = Math.min(closestDist, Math.abs(t - mid));
        }
        // Strong bonus for being near a segment midpoint (up to 150 points)
        score += 150 * Math.max(0, 1 - closestDist / 120);
      }

      // ── Preferred times bonus ──
      for (const pref of preferredMinutes) {
        const dist = Math.abs(t - pref);
        if (dist < 60) {
          score += 100 * (1 - dist / 60);
        }
      }

      // ── Avoid times penalty ──
      for (const avoid of avoidRanges) {
        let avoidEnd = avoid.end;
        if (avoidEnd <= avoid.start) avoidEnd += shiftDuration;
        if (t < avoidEnd && breakEnd > avoid.start) {
          score -= 200;
        }
      }

      // ── Prefer even distribution through the employee's own shift ──
      const empMidpoint = empOffsetFromGlobal + empShiftDuration / 2;
      if (type === 'lunch') {
        const distFromMid = Math.abs(t - empMidpoint);
        score += 50 * (1 - distFromMid / empShiftDuration);
      }

      // ── Waterfall: cascade each employee's breaks slightly later ──
      const empIndex = employees.findIndex(e => e.id === employeeId);
      const idealOffset = empIndex * spacingMinutes;
      const distFromIdeal = Math.abs(t - (windowStart + idealOffset));
      score += 30 * Math.max(0, 1 - distFromIdeal / shiftDuration);

      if (score > bestScore) {
        bestScore = score;
        bestSlot = t;
      }
    }

    const entry = {
      employeeId: brk.employeeId,
      employeeName: brk.employeeName,
      breakId: brk.breakId,
      type: brk.type,
      duration: brk.duration,
      startShiftMin: bestSlot,
      endShiftMin: bestSlot + duration,
      startTime: shiftMinutesToClock(bestSlot, shiftStart),
      endTime: shiftMinutesToClock(bestSlot + duration, shiftStart),
    };

    scheduled.push(entry);

    // Check for conflicts with other employees
    for (const other of scheduled) {
      if (other === entry) continue;
      if (other.employeeId === entry.employeeId) continue;
      if (entry.startShiftMin < other.endShiftMin && entry.endShiftMin > other.startShiftMin) {
        conflicts.push({
          employee1: entry.employeeName,
          employee2: other.employeeName,
          overlapStart: Math.max(entry.startShiftMin, other.startShiftMin),
          overlapEnd: Math.min(entry.endShiftMin, other.endShiftMin),
          overlapStartTime: shiftMinutesToClock(
            Math.max(entry.startShiftMin, other.startShiftMin), shiftStart
          ),
          overlapEndTime: shiftMinutesToClock(
            Math.min(entry.endShiftMin, other.endShiftMin), shiftStart
          ),
        });
      }
    }
  }

  // Build coverage data (how many on break per 5-min slot)
  const coverageData = [];
  for (let t = 0; t <= shiftDuration; t += 5) {
    const onBreak = scheduled.filter(
      s => t >= s.startShiftMin && t < s.endShiftMin
    ).length;
    coverageData.push({
      shiftMin: t,
      time: shiftMinutesToClock(t, shiftStart),
      onBreak,
      working: employees.length - onBreak,
    });
  }

  return {
    schedule: scheduled,
    conflicts,
    coverageData,
    shiftDuration,
  };
}
