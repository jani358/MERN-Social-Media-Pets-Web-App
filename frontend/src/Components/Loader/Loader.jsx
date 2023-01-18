import React from 'react'
import { Puff } from 'react-loader-spinner'
import './Loader.css'
function Loader() {
    return (
        <div className='center'>
            <Puff
                height="80"
                width="80"
                radisu={1}
                color="#4fa94d"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
}

export default Loader