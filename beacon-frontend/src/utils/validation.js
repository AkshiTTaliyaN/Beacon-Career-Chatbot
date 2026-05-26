const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email).trim());
}

// ─── B: name validation ──────────────────────────────────────────────────────

export function validateName(form) {
  const errors = {};
  const name = form.name?.trim() || "";
  if (!name) {
    errors.name = "Please enter your name";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (name.length > 80) {
    errors.name = "Name must be under 80 characters";
  }
  return errors;
}

// ─── Basic info (unchanged logic, name now validated separately) ─────────────

export function validateBasicInfo(form) {
  const errors = {};
  const cls = Number(form.current_class);
  if (![8, 9, 10, 11, 12].includes(cls)) errors.current_class = "Select your class";
  if (!form.board) errors.board = "Select your board";
  if (cls >= 10 && !form.stream) errors.stream = "Select your stream";
  if (!form.city?.trim()) errors.city = "Enter your city";
  if (!form.state) errors.state = "Select your state";
  return errors;
}

// ─── A: academics validation (new fields added) ──────────────────────────────

export function validateAcademics(form) {
  const errors = {};

  if (!form.performance_band)
    errors.performance_band = "Select your performance band";

  if (!form.strongest_subject)
    errors.strongest_subject = "Select your strongest subject";

  if (!form.weakest_subject)
    errors.weakest_subject = "Select your weakest subject";

  if (
    form.strongest_subject &&
    form.weakest_subject &&
    form.strongest_subject === form.weakest_subject
  ) {
    errors.weakest_subject = "Must be different from strongest subject";
  }

  // New required fields
  if (!form.study_hours)
    errors.study_hours = "Select how many hours you study per day";

  if (!form.coaching_status)
    errors.coaching_status = "Select your coaching / study setup";

  if (!form.career_clarity)
    errors.career_clarity = "Select how clear you are about your career";

  if (!form.learning_style)
    errors.learning_style = "Select your preferred learning style";

  return errors;
}

export function validateGoals(form) {
  const errors = {};
  if (!form.target_sector) errors.target_sector = "Select a target sector";
  if (!form.relocation_pref) errors.relocation_pref = "Select relocation preference";
  if (!form.cost_constraint) errors.cost_constraint = "Select cost constraint";
  return errors;
}

// ─── Build payload for POST /profile/save ───────────────────────────────────

export function buildProfilePayload(form) {
  const cls = Number(form.current_class);
  if (![8, 9, 10, 11, 12].includes(cls)) {
    throw new Error("Select a valid class before submitting.");
  }

  const payload = {
    current_class: cls,
    board: form.board,
    city: form.city.trim(),
    state: form.state,
  };

  // B: name
  if (form.name?.trim()) payload.name = form.name.trim();

  if (form.stream) {
    payload.stream = form.stream;
  } else if (cls < 10) {
    payload.stream = "none";
  }

  if (form.school_name?.trim()) payload.school_name = form.school_name.trim();

  // Existing academic
  if (form.performance_band) payload.performance_band = form.performance_band;
  if (form.strongest_subject) payload.strongest_subject = form.strongest_subject;
  if (form.weakest_subject) payload.weakest_subject = form.weakest_subject;

  // A: new academic fields
  if (form.enjoyed_subjects?.length)
    payload.enjoyed_subjects = form.enjoyed_subjects;
  if (form.study_hours) payload.study_hours = form.study_hours;
  if (form.coaching_status) payload.coaching_status = form.coaching_status;
  if (form.career_clarity) payload.career_clarity = form.career_clarity;
  if (form.learning_style) payload.learning_style = form.learning_style;
  if (form.extracurricular?.trim())
    payload.extracurricular = form.extracurricular.trim();

  // Family context
  if (form.income_bracket) payload.income_bracket = form.income_bracket;
  if (form.father_occupation) payload.father_occupation = form.father_occupation;
  if (form.mother_occupation) payload.mother_occupation = form.mother_occupation;
  if (form.relative_influence?.trim())
    payload.relative_influence = form.relative_influence.trim();
  if (form.family_preference?.trim())
    payload.family_preference = form.family_preference.trim();

  // Goals
  if (form.target_sector) payload.target_sector = form.target_sector;
  if (form.relocation_pref) payload.relocation_pref = form.relocation_pref;
  if (form.cost_constraint) payload.cost_constraint = form.cost_constraint;
  if (form.additional_notes?.trim())
    payload.additional_notes = form.additional_notes.trim();

  return payload;
}