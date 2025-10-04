const form = document.getElementById('student-form');
const list = document.getElementById('student-list');

const API = '/api/students';

// 🔹 Fetch and display all students
async function loadStudents() {
  list.innerHTML = '';
  const res = await fetch(API);
  const students = await res.json();

  students.forEach(student => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${student.name}</strong> (Age: ${student.age}, Course: ${student.course})<br>
      <button onclick="editStudent('${student._id}')">Edit</button>
      <button onclick="deleteStudent('${student._id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}
// 🔹 Add new student
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const student = {
    name: form.name.value,
    age: form.age.value,
    course: form.course.value
  };
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  form.reset();
  loadStudents();
});
// 🔹 Delete student
async function deleteStudent(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadStudents();
}

// 🔹 Edit student (prompt-based)
async function editStudent(id) {
  const res = await fetch(`${API}/${id}`);
  const student = await res.json();

  const name = prompt('Edit name:', student.name);
  const age = prompt('Edit age:', student.age);
  const course = prompt('Edit course:', student.course);

  if (name && age && course) {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, course })
    });
    loadStudents();
  }
}

// 🔹 Initial load
loadStudents();
