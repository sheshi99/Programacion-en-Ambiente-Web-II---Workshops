const apiBase = 'http://localhost:3001';
let editingCourseId = null;

// ====== CARGAR PROFESORES PARA SELECT ======
function loadProfessors() {
  fetch(`${apiBase}/professor`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('courseProfessor');
      select.innerHTML = '';
      data.forEach(p => {
        const option = document.createElement('option');
        option.value = p._id;
        option.textContent = `${p.firstName} ${p.lastName}`;
        select.appendChild(option);
      });
    })
    .catch(err => console.log(err));
}

// ====== LISTAR CURSOS ======
function listCourses() {
  fetch(`${apiBase}/course`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#courseTable tbody');
      tbody.innerHTML = '';
      data.forEach(c => {
        const professorName = document.getElementById('courseProfessor')
                                .querySelector(`option[value="${c.professorId}"]`)?.textContent || '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.name}</td>
          <td>${c.code}</td>
          <td>${c.description}</td>
          <td>${professorName}</td>
          <td>
            <button onclick='editCourse(${JSON.stringify(c)})'>Editar</button>
            <button onclick='deleteCourse("${c._id}")'>Eliminar</button>
          </td>`;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.log(err));
}

// ====== EDITAR CURSO ======
function editCourse(course) {
  editingCourseId = course._id;
  document.getElementById('courseName').value = course.name;
  document.getElementById('courseCode').value = course.code;
  document.getElementById('courseDescription').value = course.description;
  document.getElementById('courseProfessor').value = course.professorId;
  document.querySelector('button[onclick="addOrUpdateCourse()"]').textContent = "Actualizar Curso";
}

// ====== AGREGAR O ACTUALIZAR CURSO ======
function addOrUpdateCourse() {
  const data = {
    name: document.getElementById('courseName').value,
    code: document.getElementById('courseCode').value,
    description: document.getElementById('courseDescription').value,
    professorId: document.getElementById('courseProfessor').value
  };

  if (editingCourseId) {
    fetch(`${apiBase}/course/${editingCourseId}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(() => {
      editingCourseId = null;
      document.querySelector('button[onclick="addOrUpdateCourse()"]').textContent = "Agregar Curso";
      listCourses();
    })
    .catch(err => console.log(err));
  } else {
    fetch(`${apiBase}/course`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(() => listCourses())
    .catch(err => console.log(err));
  }

  // limpiar inputs
  document.getElementById('courseName').value = '';
  document.getElementById('courseCode').value = '';
  document.getElementById('courseDescription').value = '';
}

// ====== ELIMINAR CURSO ======
function deleteCourse(id) {
  if(!confirm("¿Desea eliminar este curso?")) return;
  fetch(`${apiBase}/course/${id}`, { method: 'DELETE' })
    .then(() => listCourses())
    .catch(err => console.log(err));
}

// ====== INICIALIZAR ======
window.onload = function() {
  loadProfessors();
  listCourses();
};
