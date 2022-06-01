// Example starter JavaScript for disabling form submissions if there are invalid fields
function $$(id) { return document.getElementById(id); }

function loadTime() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    var day = time.getDate();
    month = month+1;
    if (month < 10){
        month = '0'+month;
    }
    if (day < 10){
        day = '0'+day;
    }
    var defaultdate = year+'-'+month+'-'+day;
    $$('startDate').min = defaultdate;
    $$('endDate').min = defaultdate;
}

(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
        }, false);
})();

$$('form').onsubmit= ()=>{
    var validation = $$('form').checkValidity();
    $$('form').classList.add('was-validated');
    alert($$('startDate').getFullYear());
    if (validation === false){
        return false;
    }
    else{
        return true;
    }
}

$$('startDate').oninput= ()=>{
    $$('endDate').value ='';
    $$('endDate').min = $$('startDate').value;
}

window.onload = loadTime;


