import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    return currentUser ? 'You are signed in' : 'You are not signed in';
}

LandingPage.getInitialProps = async (context) => {
    const { data } = await buildClient(context).get('/api/users/currentuser');

    return data;
}

export default LandingPage;