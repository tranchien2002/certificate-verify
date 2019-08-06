
function grantStudentDegreeValidator(studentDegree) {
  if (!studentDegree || !studentDegree['degree_id']) {
    throw new Error("Request needs degree_id")
  }
  if (!studentDegree['student_id']) {
    throw new Error("Request needs student_id")
  }
  if (!studentDegree['school_id']) {
    throw new Error("Request needs school_id")
  }
  if (!studentDegree['issuer_id']) {
    throw new Error("Request needs issuer_id")
  }
  return studentDegree
}

function createStudentDegreeValidator(studentDegree) {
  if (!studentDegree || !studentDegree['id']) {
    throw new Error("Request needs id")
  }
  if (!studentDegree['degree_id']) {
    throw new Error("Request needs degree_id")
  }
  if (!studentDegree['student_id']) {
    throw new Error("Request needs student_id")
  }
  if (!studentDegree['school_id']) {
    throw new Error("Request needs school_id")
  }
  if (!studentDegree['issuer_id']) {
    throw new Error("Request needs issuer_id")
  }
  if (!studentDegree['year']) {
    throw new Error("Request needs year")
  }
  if (!studentDegree['rank_degree']) {
    throw new Error("Request needs rank_degree")
  }
  return studentDegree
}

function convertLetterScoreToGradeScore(letterScore) {
  switch (letterScore) {
    case 'A+':
      return 4
    case 'A':
      return 4
    case 'B+':
      return 3.5
    case 'B':
      return 3
    case 'C+':
      return 2.5
    case 'C':
      return 2
    case 'D+':
      return 1.5
    case 'D':
      return 1
    case 'F':
      return 0
    default:
      return 0
  }
}

function classifyDegree(CPA) {
  switch (true) {
    case (CPA >= 3.6):
      return 'EXCELLENT'
    case (CPA >= 3.2 && CPA < 3.6):
      return 'VERY GOOD'
    case (CPA >= 2.5 && CPA < 3.2):
      return 'GOOD'
    case (CPA >= 2.0 && CPA < 2.5):
      return 'AVERAGE GOOD'
    default:
      return false
  }
}


module.exports = {
  createStudentDegreeValidator,
  convertLetterScoreToGradeScore,
  classifyDegree,
  grantStudentDegreeValidator
}
