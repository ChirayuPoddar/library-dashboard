

let badge = document.querySelector('.badge');
let totalBooks = document.querySelector('.totalBooks');
let totalMem = document.querySelector('.totalMem');
let booksBorrowed = document.querySelector('.booksBorrowed');
let bookList = document.querySelector(".bookList");
let memberList = document.querySelector(".memberList");
let borrowedLists = document.querySelector(".borrowedLists");
let addMember = document.querySelector(".addMember")
let addMemberbtn = document.querySelector(".addMemberbtn")
let delMemberbtn = document.querySelector(".delMemberbtn")
let addBookName = document.querySelector(".addBookName")
let addBookqty = document.querySelector(".addBookqty")
let addBookbtn = document.querySelector(".addBookbtn")
let borrowMemName = document.querySelector(".borrowMemName")
let borrowBookName = document.querySelector(".borrowBookName")
let borrowBtn = document.querySelector(".borrowBtn")
let returnBtn = document.querySelector(".returnBtn")
let systemMsg = document.querySelector(".systemMsg");
let scrollActivity = document.querySelector(".scrollActivity");

axios.get('/AvalaibleBooks')
  .then((response)=> {
    badge.innerText = `Available Books : ${response.data}`;
  })

axios.get('/totalBooks')
  .then((response)=> {
    totalBooks.innerText = response.data;
  })

axios.get('/totalMem')
  .then((response)=> {
    totalMem.innerText = response.data;
  })

axios.get('/booksBorrowed')
  .then((response)=> {
    booksBorrowed.innerText = response.data;
  })

axios.get('/books')
  .then((response) => {
    for (let i in response.data) {
      const newlist = document.createElement("li");
newlist.innerHTML = `
    <span class="bookName">${i}</span>
    <span class="bookQty">${response.data[i]}</span>
`;
      bookList.append(newlist);
    }
  })

axios.get('/Members')
  .then((response) => {
    for (let i of response.data) {
      const newlist = document.createElement("li");
      newlist.innerText = i
      memberList.append(newlist);
    }
  })

axios.get('/borrowedLists')
  .then((response) => {
    for (let i of response.data) {
      const newlist = document.createElement("li");
      newlist.innerHTML = `
      <div class="row">
        <span>${i.Name}</span>
        <span>${i.Book}</span>
        <span>${i.date}</span>
      </div>`;
      borrowedLists.append(newlist);
    }
  })

addMemberbtn.addEventListener('click', () => {
  axios.post('/addMember', {
    Name:addMember.value
  })
  window.location.reload()
})

delMemberbtn.addEventListener('click', () => {
  axios.post('/deleteMember', {
    Name:addMember.value
  })
  window.location.reload()
})

addBookbtn.addEventListener('click', () => {
  axios.post('/addBooks', {
    book: addBookName.value,
    qty: addBookqty.value
  })
  window.location.reload()
})

borrowBtn.addEventListener('click', () => {
  axios.post('/borrowBooks', {
    name: borrowMemName.value,
    book: borrowBookName.value
  })
  window.location.reload()
})

returnBtn.addEventListener('click', () => {
  axios.post('/returnBooks', {
    name: borrowMemName.value,
    book: borrowBookName.value
  })
  window.location.reload()
})

axios.get('/memberActivity')
  .then((response) => {
    for (let i of response.data) {
      const newDiv = document.createElement("div");
      newDiv.classList.add("activity");
      if (i.count == 1) {
        newDiv.innerHTML = `<span>${i.Name}</span><div class="bar blue"></div><small>${i.count} books</small>`
      }
      if (i.count == 2) {
        newDiv.innerHTML = `<span>${i.Name}</span><div class="bar yellow"></div><small>${i.count} books</small>`
      }
      if (i.count == 3) {
        newDiv.innerHTML = `<span>${i.Name}</span><div class="bar red"></div><small>${i.count} books</small>`
      } 
      scrollActivity.appendChild(newDiv);
    }
})

axios.get('/systemMsg')
  .then((response) => {
    systemMsg.innerHTML = '';
  for (let i of response.data) {
    const newDiv = document.createElement("div");
    newDiv.innerText = i;
    newDiv.classList.add("success");
    newDiv.classList.add("msg");
    systemMsg.append(newDiv)
    systemMsg.scrollTop = systemMsg.scrollHeight;
  }
})
