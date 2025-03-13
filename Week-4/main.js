$(document).ready(function () {

    const mainContainer = document.querySelector('.ins-api-users');

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    mainContainer.appendChild(wrapper);


    function getUsers () {
        if (!localStorage.getItem('users')) return null;
        
        const { data, miliSecond } = JSON.parse(localStorage.getItem('users'));
        return (Date.now() - miliSecond < 1000 * 60 * 60 * 24) ? data : null;
    };

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
        wrapper.innerHTML = ''
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card'
            userCard.innerHTML = `
                <h3 class="user-fullname">${user.name} ${user.username}</h3>
                <p class="user-info">Email: ${user.email}</p>
                <address class="user-info">Adres: ${user.address.street}, ${user.address.suite}, ${user.address.city}</address>
            `;
            wrapper.appendChild(userCard);
        });
    };

   
        const getUser = getUsers();
        if(getUser && getUser.length > 0) {
            addUsers(getUser);
        } else {
            fetchUsers()
        }


    const style = document.createElement('style');
    style.textContent = `
        .wrapper {
            padding: 20px;
        }
        .user-card {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .user-fullname {
            color: #333;
            font-size: 1rem;
            margin: 0 0 10px 0;
        }
        .user-info {
            color: #666;
            margin: 5px 0;
        }
    `;

    mainContainer.appendChild(style);

})

