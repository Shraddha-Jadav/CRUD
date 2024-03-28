let form = document.getElementById('form');
let submit = document.getElementById('submit');
let closeBtn = document.getElementById('close-btn');

let tbody = document.getElementById('user-tbody');

// personal
let fname = document.getElementById('fname');
let lname = document.getElementById('lname');
let dob = document.getElementById('dob');
let email = document.getElementById('email');
let address = document.getElementById('address');
let gy = document.getElementById('gy');
let country = document.getElementById('country');

// education
let eduBody = document.getElementById('edu-body');
let addEduBtn = document.getElementById('add-edu');

// error
let fnameError = document.getElementById('fnameError');
let lnameError = document.getElementById('lnameError');
let dobError = document.getElementById('dobError');
let emailError = document.getElementById('emailError');
let addressError = document.getElementById('addressError');
let gyError = document.getElementById('gyError');

let table = new DataTable("#userTable");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm();
})

const validateForm = () => {
    let isValid = true;

    let currentDate = new Date().getFullYear();
    let birthYear = new Date(dob.value).getFullYear();
    let birthYearDiff = currentDate - birthYear;
    let gradYear = new Date(gy.value).getFullYear();
    let gradYearDiff = gradYear - birthYear;

    let hobby = document.querySelectorAll('input[type="checkbox"][name="hobby"]:checked');

    // let emailRegex = /^[^\s@0-9]+@[^\s@0-9]+\.[^\s@0-9]+$/;
    let emailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;

    if (fname.value.trim() === '') {
        isValid = false;
        fnameError.classList.add('invalid-feedback')
        fnameError.innerHTML = "First Name should not be null!!!"
    }

    if (lname.value.trim() === '') {
        isValid = false;
        lnameError.classList.add('invalid-feedback')
        lnameError.innerHTML = "Last Name should not be null!!!"
    }

    if (dob.value.trim() === '') {
        isValid = false;
        dobError.classList.add('invalid-feedback');
        dobError.innerHTML = "Date of birth should not be null!!!"
    }
    else if (birthYearDiff <= 18) {
        isValid = false;
        dobError.classList.add('invalid-feedback');
        dobError.innerHTML = "Minimum age should be 18!!!"
    }

    if (email.value.trim() === '') {
        isValid = false;
        emailError.classList.add('invalid-feedback');
        emailError.innerHTML = "Email should not be null!!!"
    }
    else if (!emailRegex.test(email.value)) {
        isValid = false;
        emailError.classList.add('invalid-feedback');
        emailError.innerHTML = "Email format not proper"
    }

    if (address.value.trim() === '') {
        isValid = false;
        addressError.classList.add('invalid-feedback');
        addressError.innerHTML = "Address should not be null!!!"
    }

    if (gy.value.trim() === '') {
        isValid = false;
        gyError.classList.add('invalid-feedback');
        gyError.innerHTML = "Graduation Yaer should not be null!!!"
    }
    else if (gradYearDiff < 10) {
        isValid = false;
        gyError.classList.add('invalid-feedback');
        gyError.innerHTML = "Difference between graduation year and birth year should be minimum 10!!!"
    }

    if (isValid) {
        let val = submit.getAttribute('data-action');
        if (val === "add") {
            createList();
        }
        else {
            updateList();
        }

        closeBtn.click();
        defaultRow();
        form.reset();
        resetError();
    }
    else {
        console.log("Invalid")
    }
}

const resetError = () => {
    fnameError.innerHTML = "";
    fnameError.classList.remove('invalid-feedback');

    lnameError.innerHTML = "";
    lnameError.classList.remove('invalid-feedback');

    dobError.innerHTML = "";
    dobError.classList.remove('invalid-feedback');

    emailError.innerHTML = "";
    emailError.classList.remove('invalid-feedback');

    addressError.innerHTML = "";
    addressError.classList.remove('invalid-feedback');

    gyError.innerHTML = "";
    gyError.classList.remove('invalid-feedback');
}

const defaultRow = () => {
    eduBody.innerHTML = `
    <tr>
        <td><input type="text" id="degree" class="form-control" value="10th" disabled></td>
        <td><input type="text" id="school" class="form-control" required></td>
        <td><input type="month" id="sdate" class="form-control" required></td>
        <td><input type="month" id="pdate" class="form-control" required></td>
        <td><input type="number" id="percentage" class="form-control" required></td>
        <td><input type="number" id="backlog" class="form-control" required></td>
    </tr>
    <tr>
        <td><input type="text" id="degree" class="form-control" value="12th" required disabled></td>
        <td><input type="text" id="school" class="form-control" required></td>
        <td><input type="month" id="sdate" class="form-control" required></td>
        <td><input type="month" id="pdate" class="form-control" required></td>
        <td><input type="number" id="percentage" class="form-control" required></td>
        <td><input type="number" id="backlog" class="form-control" required></td>
    </tr>
    `;
}

let userList = [];

const setLocalStorage = (userList) => {
    localStorage.setItem('userList', JSON.stringify(userList));
}

const getLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userList')) || [];
}

const createList = () => {
    let rows = document.querySelectorAll('#edu-body tr')
    let eduData = [];
    const gender = document.querySelector('input[name="gender"]:checked');

    let hobby = document.querySelectorAll('input[type="checkbox"][name="hobby"]:checked');
    let hobbies = [];
    hobby.forEach((e) => {
        hobbies.push(e.value)
    })

    rows.forEach((row) => {
        let eduRow = {
            degree: row.querySelector('#degree').value,
            school: row.querySelector('#school').value,
            sdate: row.querySelector('#sdate').value,
            pdate: row.querySelector('#pdate').value,
            percentage: row.querySelector('#percentage').value,
            backlog: row.querySelector('#backlog').value
        }
        eduData.push(eduRow);
    })

    let personalData = {
        fname: fname.value,
        lname: lname.value,
        dob: dob.value,
        email: email.value,
        address: address.value,
        gYear: gy.value,
        gender: gender.value,
        hobbies: hobbies,
        country: country.value,
        educations: eduData
    }

    let userList = getLocalStorage();
    userList.push(personalData);
    setLocalStorage(userList);

    renderList();
}

const renderList = () => {
    let userList = getLocalStorage();

    table.clear();

    userList.forEach((list, index) => {
        let {fname, lname, dob, email, address, gYear, gender, hobbies, country} = list; 
        table.row.add([
            `<button class="btn border-0" onclick="showNestedTable(${index}, this)" ><i class="fa fa-eye fa-lg"></i></button>`,
            fname,
            lname,
            dob,
            email,
            address,
            gYear,
            gender,
            hobbies,
            country,
            `<button class="btn border-0"><i class="fa-solid fa-pen-to-square fa-lg" onclick="updateForm(${index})"></i></button>`,
            `<button class="btn border-0"><i class="fa-solid fa-trash-can fa-lg" onclick="deleteList(${index})"></i></button>`
        ]).draw();
    });
}

const showNestedTable = (index, t) => {
    let userList = getLocalStorage();
    let educations = userList[index].educations;

    let tr = $(t).closest('tr');

    let neastedTable = `<table class="table w-100 table-light">
                                <thead>
                                    <tr>
                                        <th>Degree</th>
                                        <th>School</th>
                                        <th>Start Date</th>
                                        <th>PassOut Year</th>
                                        <th>Percentage</th>
                                        <th>Backlog</th>
                                    </tr>
                                </thead>
                            <tbody>`;

                            educations.forEach(e => {
                                neastedTable += `<tr>
                                                    <td>${e.degree}</td>
                                                    <td>${e.school}</td>
                                                    <td>${e.sdate}</td>
                                                    <td>${e.pdate}</td>
                                                    <td>${e.percentage}</td>
                                                    <td>${e.backlog}</td>
                                                <tr>`;
                            })

                            neastedTable += `</tbody>
                                </table>`;

    if(table.row(tr).child.isShown()) 
        table.row(tr).child(neastedTable).hide();
    else 
        table.row(tr).child(neastedTable).show();
}

const deleteList = (index) => {
    if (confirm("Are you sure to delete this user??")) {
        let userList = getLocalStorage();
        userList.splice(index, 1);
        setLocalStorage(userList)
        renderList();
    }
}

const updateForm = (index) => {
    let openForm = document.getElementById('open-btn');
    openForm.click();

    submit.innerHTML = "Update";

    let userList = getLocalStorage();

    const currentList = userList[index];
    const gender = document.querySelector(`input[name="gender"][value="${currentList.gender}"]`)

    fname.value = currentList.fname;
    lname.value = currentList.lname;
    dob.value = currentList.dob;
    email.value = currentList.email;
    address.value = currentList.address;
    gy.value = currentList.gYear;
    gender.checked = true;
    currentList.hobbies.forEach(hobby => {
        document.getElementById(hobby).checked = true;
    });
    country.value = currentList.country;
    let educations = currentList.educations;


    eduBody.innerHTML = '';
    educations.forEach((row, index) => {
        let newRow = document.createElement('tr');
        let disable = index < 2 ? 'd-none' : '';
        newRow.innerHTML = `
        <td><input type="text" id="degree" class="form-control" value="${row.degree}" required></td>
        <td><input type="text" id="school" class="form-control" value="${row.school}" required></td>
        <td><input type="month" id="sdate" class="form-control" value="${row.sdate}" required></td>
        <td><input type="month" id="pdate" class="form-control" value="${row.pdate}" required></td>
        <td><input type="number" id="percentage" class="form-control" value="${row.percentage}" required></td>
        <td><input type="number" id="backlog" class="form-control" value="${row.backlog}" required></td>
        <td class="text-center"><button class="border-0 bg-transparent  ${disable}" onclick="deleteEduRow(this)"><i class="fa-solid fa-xmark fa-lg"></i></button></td>
        `;
        eduBody.appendChild(newRow);
    })

    submit.setAttribute('data-action', 'update');
    submit.setAttribute('data-list-index', index);

}

const updateList = () => {
    let index = submit.getAttribute('data-list-index');
    let userList = getLocalStorage();

    let rows = document.querySelectorAll('#edu-body tr')
    let eduData = [];

    const gender = document.querySelector(`input[name="gender"]:checked`)
    let hobby = document.querySelectorAll('input[type="checkbox"][name="hobby"]:checked');
    let hobbies = [];
    hobby.forEach((e) => {
        hobbies.push(e.value)
    })

    rows.forEach((row) => {
        let eduRow = {
            degree: row.querySelector('#degree').value,
            school: row.querySelector('#school').value,
            sdate: row.querySelector('#sdate').value,
            pdate: row.querySelector('#pdate').value,
            percentage: row.querySelector('#percentage').value,
            backlog: row.querySelector('#backlog').value
        }
        eduData.push(eduRow);
    })

    let modifiedList = {
        fname: fname.value,
        lname: lname.value,
        dob: dob.value,
        email: email.value,
        address: address.value,
        gYear: gy.value,
        gender: gender.value,
        hobbies: hobbies,
        country: country.value,
        educations: eduData
    }

    userList[index] = modifiedList;

    setLocalStorage(userList);

    submit.innerHTML = 'Submit';
    submit.setAttribute('data-action', 'add');

    form.reset();

    renderList();
}

addEduBtn.addEventListener('click', () => {
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="degree" class="form-control"></td>
        <td><input type="text" id="school" class="form-control"></td>
        <td><input type="month" id="sdate" class="form-control"> </td>
        <td><input type="month" id="pdate" class="form-control"> </td>
        <td><input type="number" id="percentage" class="form-control" min="0" max="100"></td>
        <td><input type="number" id="backlog" class="form-control" min="0" max="10"></td>
        <td class="text-center"><button class="border-0 bg-transparent" onclick="deleteEduRow(this)"><i class="fa-solid fa-xmark fa-lg"></i></button></td>
    `
    eduBody.appendChild(newRow);
})

const deleteEduRow = (row) => {
    row.parentNode.parentNode.remove();
}

let x = renderList();