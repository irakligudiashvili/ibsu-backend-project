document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchType = document.getElementById('searchType');

    searchForm.addEventListener('submit', () => {
        const selectedOption = searchType.value;
        const searchTerm = searchForm.elements['searchTerm'].value.trim();
        if (selectedOption === 'post') {
            searchForm.action = `/search/${searchTerm}`;
        } else if (selectedOption === 'author') {
            searchForm.action = `/author/${searchTerm}`;
        }
    });

    const deleteBtn = document.getElementById('delete-btn');

    deleteBtn.addEventListener('click', async () => {
        const postId = deleteBtn.getAttribute('data-id');

        if(confirm('Are you sure you want to delete this post?')){
            console.log(postId);

            const response = await fetch(`${postId}`, {
                method: 'DELETE'
            });

            if(response.ok) {
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                console.error('Delete failed:', errorData);
                alert('Failed to delete post');
            }
        }
    })

    const editBtn = document.getElementById('edit-btn');

    editBtn.addEventListener('click', async () => {
        const postId = editBtn.getAttribute('data-id');

        window.location.href = `/edit/${postId}`;
    })

    const editConfirmBtn = document.getElementById('edit-confirm-btn');

    editConfirmBtn.addEventListener('click', async () => {
        const postId = editConfirmBtn.getAttribute('data-id');

        window.location.href = `/update/${postId}`;
    });
})