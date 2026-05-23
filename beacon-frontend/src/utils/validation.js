const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email).trim());
}

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

export function validateAcademics(form) {
  const errors = {};
  if (!form.performance_band) errors.performance_band = "Select your performance band";
  if (!form.strongest_subject) errors.strongest_subject = "Select your strongest subject";
  if (!form.weakest_subject) errors.weakest_subject = "Select your weakest subject";
  if (
    form.strongest_subject &&
    form.weakest_subject &&
    form.strongest_subject === form.weakest_subject
  ) {
    errors.weakest_subject = "Must be different from strongest subject";
  }
  return errors;
}

export function validateGoals(form) {
  const errors = {};
  if (!form.target_sector) errors.target_sector = "Select a target sector";
  if (!form.relocation_pref) errors.relocation_pref = "Select relocation preference";
  if (!form.cost_constraint) errors.cost_constraint = "Select cost constraint";
  return errors;
}

export function buildProfilePayload(form) {
  // Bug 1 fix: guard against invalid / unparseable class value
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

  if (form.stream) {
    payload.stream = form.stream;
  } else if (cls < 10) {
    payload.stream = "none";
  }

  if (form.school_name?.trim()) payload.school_name = form.school_name.trim();
  if (form.performance_band) payload.performance_band = form.performance_band;
  if (form.strongest_subject) payload.strongest_subject = form.strongest_subject;
  if (form.weakest_subject) payload.weakest_subject = form.weakest_subject;
  if (form.income_bracket) payload.income_bracket = form.income_bracket;
  if (form.father_occupation) payload.father_occupation = form.father_occupation;
  if (form.mother_occupation) payload.mother_occupation = form.mother_occupation;
  if (form.relative_influence?.trim())
    payload.relative_influence = form.relative_influence.trim();
  if (form.family_preference?.trim())
    payload.family_preference = form.family_preference.trim();
  if (form.target_sector) payload.target_sector = form.target_sector;
  if (form.relocation_pref) payload.relocation_pref = form.relocation_pref;
  if (form.cost_constraint) payload.cost_constraint = form.cost_constraint;
  if (form.additional_notes?.trim())
    payload.additional_notes = form.additional_notes.trim();

  return payload;
}