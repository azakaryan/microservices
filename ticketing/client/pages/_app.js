import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div style={{margin: '15px'}}>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const client = buildClient(ctx)
    const { data } = await client.get('/api/users/currentuser');

    // This is to call page component getIniialProps.
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
    }
    
    return {
        pageProps,
        ...data,
    };
}

export default AppComponent;