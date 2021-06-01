import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div style={{margin: '15px'}}>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const { data } = await buildClient(ctx).get('/api/users/currentuser');

    // This is to call page component getIniialProps.
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    
    return {
        pageProps,
        ...data,
    };
}

export default AppComponent;