// Late (more than 15 days)
// want to return the book (if applicable apply late fees after 5 days of rs 5 per day)
// const fs = require('fs');
// const path = require('path');
// const booksfile = path.join(__dirname, 'data', books.json);
// const studentsfile = path.join(__dirname, 'data', students.json);
// let booksdata = fs.readFileSync(booksfile, 'utf-8');
// let studentsdata = fs.readFileSync(studentsfile, 'utf-8');
// booksdata = JSON.parse(booksdata);
// studentsdata = JSON.parse(studentsdata);

const express = require('express');
const path=require('path')
const cors = require('cors'); // 1. Import CORS
const app = express();

app.use(cors()); // 2. Enable CORS for all requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))

let allDetails = [];
let systemMsg = [];
let obj = {
    total: 23,
    books: {
        "Atomic Habits": 3,
        "Rich Dad Poor Dad": 4,
        "The Alchemist": 2,
        "Deep Work": 5,
        "Clean Code": 4
    },
    members: [
        "Aarav",
        "Diya",
        "Rohan",
        "Sneha",
        "Kabir"
    ],
    borrowedList: [
        { Name: "Aarav", Book: "Atomic Habits", date: "17/04/2026" },
        { Name: "Diya", Book: "Rich Dad Poor Dad", date: "16/04/2026" },
        { Name: "Rohan", Book: "Deep Work", date: "15/04/2026" },
        { Name: "Sneha", Book: "Clean Code", date: "14/04/2026" },
        { Name: "Kabir", Book: "The Alchemist", date: "13/04/2026" }
    ]
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/AvalaibleBooks', (req, res) => {
    res.send(obj.total-obj.borrowedList.length);
})

app.get('/totalBooks', (req, res) => {
    res.send(obj.total);
})

app.get('/totalMem', (req, res) => {
    res.send(obj.members.length);
})

app.get('/booksBorrowed', (req, res) => {
    res.send(obj.borrowedList.length);
})

app.get('/books', (req, res) => {
    res.send(obj.books);
})

app.get('/Members', (req, res) => {
    res.send(obj.members);
})

app.get('/borrowedLists', (req, res) => {
    res.send(obj.borrowedList);
})

app.get('/systemMsg', (req, res) => {
    res.send(systemMsg);
})

app.post('/addMember', (req, res) => {
    const { Name } = req.body;
    if (obj.members.includes(Name)) {
        systemMsg.push(`${ Name } already exists as a member`)
        return;
    }
    obj.members.push(Name);
    systemMsg.push(`${ Name } has been added successfuly`)
})



app.post('/deleteMember', (req, res) => {
    const { Name } = req.body;
    let newMember = obj.members.filter(i => i !== Name);
    if (newMember.length === obj.members.length) {
        systemMsg.push(`${Name} does not exist as a member`)
    }
    else {
    obj.members = newMember;
    systemMsg.push(`${Name} has been deleted successfully`)   
    }
    
})

app.post('/addBooks', (req, res) => {
    const { book, qty } = req.body;
    obj.total += parseInt(qty);
    if (obj.books[book]!==undefined) {
        obj.books[book]+=parseInt(qty);
    }
    else {
        obj.books[book]=parseInt(qty);
    }
    systemMsg.push(`${book} book has been added successfully`)  
})

app.post('/borrowBooks', (req, res) => {
    details();
    const { name, book } = req.body;
    if (!obj.members.includes(name)) {
        systemMsg.push(`${name} does not exists as a member`)  
        return;
    }
    if (Boolean(obj.books[book]) === false) {
        systemMsg.push(`${book} is not available`)  
        return;
    }
    let flag = false;
    for (let i of allDetails) {
        if (i.Name === name && i.count < 3) {
            i.count++;
            flag = true;
        }
    }
    if (flag) {
        const date = new Date();
        const day=String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayMonthStr = `${day}/${month}/${date.getFullYear()}`;
    let b = {
        Name: name,
        Book: book,
        date: dayMonthStr
    }
    obj.borrowedList.push(b);
        obj.books[book]--;
        systemMsg.push(`The book has been borrowed successfully`)
    } else {
        systemMsg.push(`${name} had already borrowed three books`)
    }
})

app.post('/returnBooks', (req, res) => {
    const {name,book} = req.body;
    for (let i of obj.borrowedList) {
        if (i.Name === name && i.Book === book) {
            let idx = obj.borrowedList.indexOf(i);
            obj.borrowedList.splice(idx, 1);
            obj.books[book]++;
            break;
        }
    }
    systemMsg.push(`${book} had been returned successfully`)
})

app.get('/memberActivity', (req, res) => {
    details();
    res.send(allDetails);
})

const PORT = process.env.PORT || 3232;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

function details() {
    allDetails = [];
    for (let i of obj.members) {
        let info = {
            Name: '',
            count: 0,
            list: []
        };
        info.Name = i;
        let bookDetail = [];
        for (let j of obj.borrowedList) {
            if (j.Name == i) {
                info.count++;
                bookDetail.push(j.Book)
            }
        }
        info.list = bookDetail;
        allDetails.push(info);
    }
}