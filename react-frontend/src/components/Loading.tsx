import './Loading.scss';

const spinners = {
    hourglass: <div className={'lds-hourglass'}></div>,
    ripple: <div className={'lds-ripple'}><div></div><div></div></div>,
    ring: <div className={'lds-ring'}><div></div><div></div><div></div><div></div></div>,
    spinner: <div className='lds-spinner'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
}

const Loading = (props: {
    message: string,
    spinner?: 'hourglass' | 'ripple' | 'ring' | 'spinner'
}) => {
    return (
        <div className={'login_load'}>
            {props?.spinner ? spinners[props.spinner] : spinners['ring']}
            <p>{props.message}</p>
        </div>
    );
}

export default Loading;
