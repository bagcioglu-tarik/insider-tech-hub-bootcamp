// ins-api-users ilk odevdeki default className adidir 
// herhangi bir siteye gidip direkt console'a asagidaki kodlari yapistirmaniz yeterlidir
// gittiginiz sitede 'SecurityError: The operation is insecure hatasi' alirsaniz cookielere izin veriniz veya http uzantili bir siteye gidiniz

const appendLocation = 'ins-api-users';
document.body.innerHTML = `<div class='${appendLocation}'></div>`

function injectApp() {
    const mainContainer = document.querySelector(`.${appendLocation}`);
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    mainContainer.appendChild(wrapper);

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Guncelle';
    updateBtn.className = 'update-btn';
    updateBtn.style.display = 'none';
    mainContainer.appendChild(updateBtn);

    function getUsers() {
        if (!localStorage.getItem('users')) return null;
        
        const { data, miliSecond } = JSON.parse(localStorage.getItem('users'));
        return (Date.now() - miliSecond < 1000 * 60 * 60 * 24) ? data : null;
    }

    async function fetchUsers() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");

            if (response.status !== 200) throw new Error(`HTTP hatasi: ${response.status}`); 
            
            const data = await response.json();
            
            localStorage.setItem('users', JSON.stringify({ 
                data: data, 
                miliSecond: Date.now() 
            }));
            
            addUsers(data);
        } catch (error) {
            alert(`Veri alinamadi Hata: ${error.message}`);
        }
    }


    function addUsers(users) {
        wrapper.innerHTML = '';
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = 
            
            `
                <h2 class="user-fullname">${user.name} ${user.username}</h2>
                <p class="user-info">Email: ${user.email}</p>
                <address class="user-info">Address: ${user.address.street}, ${user.address.suite}, ${user.address.city}</address>
                <button class="delete-btn">Sil</button>
            `;

            userCard.querySelector(".delete-btn").onclick = () => deleteCard(user.id);

            wrapper.appendChild(userCard);
        });
    }

    function deleteCard(userId) {
        
        if (!JSON.parse(localStorage.getItem('users'))) return;

        const filteredUsers = JSON.parse(localStorage.getItem('users')).data.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify({
            data: filteredUsers,
            miliSecond: JSON.parse(localStorage.getItem('users')).miliSecond
        }));
        
        addUsers(filteredUsers);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                if (wrapper.children.length) {
                updateBtn.style.display = 'none'  
                } else {      
                updateBtn.style.display = 'block'     
                }       
            } 
         });  
    });
        
    observer.observe(wrapper, { childList: true });

    updateBtn.addEventListener('click', () => {
        if (!sessionStorage.getItem('updated')) {
            fetchUsers();
            sessionStorage.setItem('updated', 'true');
            updateBtn.style.display = 'none';
            updateBtn.classList.add('deactive')
        }
    });

    const getUser = getUsers();
        if(getUser && getUser.length > 0) {
            addUsers(getUser);
        } else {
            fetchUsers()
        }


    const style = document.createElement('style');
    style.textContent = 
    
    `
        .wrapper {
            padding: 20px;
            display: grid;
            gap: 15px;
        }

        .user-card {
            background: whitesmoke;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
        }

        .user-fullname {
            color: black;
            font-size: 1rem;
            margin: 0 0 10px 0;
        }

        .user-info {
            color: gray;
            margin: 5px 0;
        }

        .delete-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }

        .update-btn {
            margin: 20px auto;
            display: block;
            padding: 10px 20px;
            background: green;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .deactive {
        background:rgba(77, 83, 78, 0.3);
        cursor: not-allowed;
        }
    `;
    
    mainContainer.appendChild(style);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectApp);
} else {
    injectApp();
}