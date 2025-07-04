let customers = JSON.parse(localStorage.getItem("customers")) || [];

const form = document.getElementById("addForm");
const table = document.getElementById("customerTable");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");
const totalBottlesSpan = document.getElementById("totalBottles");
const totalBonusSpan = document.getElementById("totalBonus");

const rowsPerPage = 10;
let currentPage = 1;

function calculateBonus(bottles) {
  return Math.floor(bottles / 10);
}

function saveData() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

function getFilteredData() {
  const keyword = searchInput.value.toLowerCase();
  return customers.filter((c) => c.name.toLowerCase().includes(keyword));
}

function renderTable() {
  const filtered = getFilteredData();
  const start = (currentPage - 1) * rowsPerPage;
  const paginatedData = filtered.slice(start, start + rowsPerPage);

  table.innerHTML = "";
  let totalBottles = 0;
  let totalBonus = 0;

  paginatedData.forEach((c, index) => {
    const bonus = calculateBonus(c.bottles);
    totalBottles += c.bottles;
    totalBonus += bonus;

    table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.bottles}</td>
        <td>${bonus}</td>
        <td>${parseFloat(c.price).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="openEdit(${customers.indexOf(c)})">แก้ไข</button>
          <button class="btn btn-sm btn-danger" onclick="removeCustomer(${customers.indexOf(c)})">ลบ</button>
        </td>
      </tr>
    `;
  });

  totalBottlesSpan.textContent = filtered.reduce((sum, c) => sum + c.bottles, 0);
  totalBonusSpan.textContent = filtered.reduce((sum, c) => sum + calculateBonus(c.bottles), 0);

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === currentPage ? " active" : "");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderTable();
    });
    pagination.appendChild(li);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const bottles = +document.getElementById("bottles").value;
  const price = +document.getElementById("price").value;
  customers.push({ name, bottles, price });
  saveData();
  currentPage = 1;
  renderTable();
  form.reset();
});

function removeCustomer(index) {
  if (confirm("ยืนยันการลบข้อมูลลูกค้าคนนี้?")) {
    customers.splice(index, 1);
    saveData();
    renderTable();
  }
}

function openEdit(index) {
  const c = customers[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("editName").value = c.name;
  document.getElementById("editBottles").value = c.bottles;
  document.getElementById("editPrice").value = c.price;
  new bootstrap.Modal(document.getElementById("editModal")).show();
}

document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = +document.getElementById("editIndex").value;
  customers[index].name = document.getElementById("editName").value.trim();
  customers[index].bottles = +document.getElementById("editBottles").value;
  customers[index].price = +document.getElementById("editPrice").value;
  saveData();
  renderTable();
  bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable();
});

renderTable();
