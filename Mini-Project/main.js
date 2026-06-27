'use strict'
const getScoreBtn = document.getElementById("start-btn");
const gradeContainer = document.getElementById("grade-output");



getScoreBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let scoreValue = prompt("Enter Your Grade: ");
  if(scoreValue === null || scoreValue === "") return
  else scoreValue = +scoreValue;
  gradeContainer.textContent = calcGrade(scoreValue);
});

function calcGrade(grade) {
  switch (true) {
    case grade >= 90 && grade <= 100:
      gradeContainer.style.color = '#10b981';
      return "A";
    case grade >= 80 && grade <= 89:
      gradeContainer.style.color = "#0ea5e9";
      return "B";
    case grade >= 70 && grade <= 79:
      gradeContainer.style.color = "#6366f1";
      return "C";
    case grade >= 60 && grade <= 69:
      gradeContainer.style.color = "#f59e0b";
      return "D";
    case grade >= 0 && grade < 60:
      gradeContainer.style.color = "#f43f5e";
      return "F";
    default:
      gradeContainer.style.color = "#64748b";
      return "Invalid Score";
  }
}