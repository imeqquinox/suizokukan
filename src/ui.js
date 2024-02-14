export function setupUI(isDebugging, ) {
    // Toggle dropdown
    window.toggleDropDown = function(dropdown) { 
        let dropdowns = document.getElementsByClassName('dropdown-content');
    
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    
        document.getElementById(dropdown).classList.toggle('show');
    }

    // Close dropdown
    window.onclick = function(e) {
        if (!e.target.matches('.dropDown-btn')) {
            let dropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i]; 
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    // Change Tank model
    let tankBtns = document.getElementsByClassName('tank-btn');
    Array.from(tankBtns).forEach(element => {
        element.addEventListener('click', changeTank);
    });
}

// Dont like the function here but main windows call event in main
export function togglePhysicsDebuggerUI(isDebugging, setIsDebugging, debugMeshes) {
    // Toggle phyiscs debugger
    setIsDebugging(!isDebugging)
    debugMeshes.forEach(mesh => {
        mesh.visible = !isDebugging;
    })
}

function changeTank() {
    console.log('TODO');
}