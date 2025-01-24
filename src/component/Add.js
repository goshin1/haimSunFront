import './add.css';
import { useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone';

export default function Add(props){
    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        height: '100%', // 컨테이너 높이를 부모에 맞게 조정
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto'
    };

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: '95%', // 부모 크기에 따라 조정
        height: '95%',
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    };

    const media = {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain' // 미디어가 영역에 꽉 차도록 유지
    };

    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': [],
            'video/*': []
        },
        maxFiles: 1, // 파일 하나만 허용
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                {file.type.startsWith('image') ? (
                    <img
                        src={file.preview}
                        style={media}
                        alt={file.name}
                    />
                ) : (
                    <video
                        src={file.preview}
                        style={media}
                        controls
                        alt={file.name}
                    />
                )}
            </div>
        </div>
    ));

    useEffect(() => {
        // Clean up previews when component unmounts
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return <div className="add">
        <div className="addForm">
            <h2>Add Farm</h2>
            <form onSubmit={async (event) => {
                event.preventDefault();

                // 폼 데이터 가져오기
                const title = event.target.title.value;
                const description = event.target.description.value;
                const start = event.target.start.value;
                const end = event.target.end.value;
                const file = event.target.uploadFile.files[0];

                // 사용자 ID (외부 변수 참조)
                const user_id = props.user_id;

                // 모든 필드 유효성 검사
                if (!title || !description || !start || !end || !file) {
                    alert('모든 필드를 입력해주세요.');
                    return;
                }

                // FormData 생성
                const formData = new FormData();
                formData.append('user_id', user_id);
                formData.append('title', title); // 서버가 title을 요구한다면 추가
                formData.append('description', description);
                formData.append('start', start);
                formData.append('end', end);
                formData.append('upload', file); // 파일 첨부

                try {
                    // 서버에 데이터 전송
                    const response = await fetch('https://heimsunback-production.up.railway.app/farm/add', {
                        method: 'POST',
                        body: formData, // FormData 전송
                        mode : 'cors'
                    });

                    if (response.ok) {
                        alert('일정이 성공적으로 추가되었습니다.');
                        event.target.reset(); // 폼 리셋
                    } else {
                        const errorData = await response.json();
                        console.error('서버 응답 오류:', errorData);
                        alert('일정 추가 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('서버와의 통신 중 문제가 발생했습니다.');
                }
            }}>
                <input name="title" type="text" placeholder='title'/>
                <textarea name="description" placeholder='description'></textarea>
                <input type='datetime-local' name='start' placeholder='Start'/>
                <input type='datetime-local' name='end' placeholder='End'/>
                <section className="container">
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} name='uploadFile' />
                        <p>Drag 'n' drop an image or video here, or click to select one</p>
                    </div>
                </section>
                <input type='submit' value='Add'/>
            </form>
        </div>
        <div style={thumbsContainer}>
            {thumbs}
        </div>
    </div>
}
