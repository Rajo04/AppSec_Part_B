const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const token = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("loggedInUser") || '{}')?.token : '';

const getAllCoaches = () => {
    return fetch(apiUrl + '/coaches', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const CoachService = { getAllCoaches };

export default CoachService;
