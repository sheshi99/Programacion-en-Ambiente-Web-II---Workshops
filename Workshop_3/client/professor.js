const apiBase = 'http://localhost:3001';
let editingProfessorId = null;

// ====== LISTAR PROFESORES ======
function listProfessors() {
  fetch(`${apiBase}/professor`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#professorTable tbody');
      tbody.innerHTML = '';
      data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.firstName}</td>
          <td>${p.lastName}</td>
          <td>${p.idNumber}</td>
          <td>${p.age}</td>
          <td>
            <button onclick='editProfessor("${p._id}")'>Editar</button>
            <button onclick='deleteProfessor("${p._id}")'>Eliminar</button>
          </td>`;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.log(err));
}

// ====== EDITAR PROFESOR ======
function editProfessor(id) {
  fetch(`${apiBase}/professor?id=${id}`)
    .then(res => res.json())
    .then(p => {
      if(!p) return alert('Profesor no encontrado');
      editingProfessorId = p._id;
      document.getElementById('firstName').value = p.firstName;
      document.getElementById('lastName').value = p.lastName;
      document.getElementById('idNumber').value = p.idNumber;
      document.getElementById('age').value = p.age;
      document.getElementById('saveBtn').textContent = "Actualizar Profesor";
    })
    .catch(err => console.log(err));
}

// ====== AGREGAR O ACTUALIZAR PROFESOR ======
function saveProfessor() {
  const data = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    idNumber: document.getElementById('idNumber').value,
    age: document.getElementById('age').value
  };

  if(editingProfessorId) {
    fetch(`${apiBase}/professor/${editingProfessorId}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(() => {
      editingProfessorId = null;
      document.getElementById('saveBtn').textContent = "Agregar Profesor";
      listProfessors();
    })
    .catch(err => console.log(err));
  } else {
    fetch(`${apiBase}/professor`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(() => listProfessors())
    .catch(err => console.log(err));
  }

  // limpiar inputs
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('idNumber').value = '';
  document.getElementById('age').value = '';
}

// ====== ELIMINAR PROFESOR ======
function deleteProfessor(id) {
  if(!confirm("¿Desea eliminar este profesor?")) return;
  fetch(`${apiBase}/professor/${id}`, { method: 'DELETE' })
    .then(() => listProfessors())
    .catch(err => console.log(err));
}

// ejecutar al cargar la página
window.onload = listProfessors;
