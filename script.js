const FDS = document.getElementById('FDS');
FDS.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://192.168.1.10:3000/fdar', {
            method : 'POST',
            headers : {'Content-type':'application/json'},
            body : JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Kết quả từ server", result)
    } catch (error){
        console.error("Lỗi gửi dữ liệu :", error);
    }
});