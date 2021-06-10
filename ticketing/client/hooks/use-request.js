import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, body }) => {
    const [errors, setErrors] = useState(null);
 
    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const resp = await axios[method](url, { ...body, ...props });
            return resp.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(e => {
                            return <li key={e.message}>{e.message}</li>;
                        })}
                    </ul>
                </div>
            );

            throw err;
        }
    };

    return { doRequest, errors };
}