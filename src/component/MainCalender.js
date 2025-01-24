import './mainCalender.css'
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // 사용자 상호작용 플러그인
import axios from "axios"; // REST API 호출을 위해 axios 사용

export default function MainCalendar(props) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 정보
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
    const user_id = props.user_id;

    // 날짜 포맷팅 유틸리티 함수
    const formatDate = (date) => {
        const pad = (num) => String(num).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // 서버에서 이벤트 가져오기
    const fetchEvents = async (date) => {
        const { start, end } = getMonthRange(date);
        try {
            const formattedStart = formatDate(new Date(start));
            const response = await axios.post(
                "https://heimsunback-production.up.railway.app/farm/month",
                { user_id, month: formattedStart }
            );
            if (response.data) {
                const fetchedEvents = response.data.map((event) => ({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    description: event.description || "", // 추가적인 설명 필드
                    upload: event.upload
                }));
                setEvents(fetchedEvents);
            }
        } catch (err) {
            console.error("Failed to fetch events:", err);
        }
    };

    const getMonthRange = (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { start, end };
    };

    useEffect(() => {
        fetchEvents(new Date());
    }, []);

    const handleDatesSet = (dateInfo) => {
        fetchEvents(dateInfo.start);
    };

    // 팝업 열기
    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.startStr,
            end: clickInfo.event.endStr,
            description: clickInfo.event.extendedProps.description || "",
            upload: clickInfo.event.extendedProps.upload || null, // upload 정보 추가
        });
        setIsPopupOpen(true); // 팝업 열기
    };

    // 팝업 닫기
    const handleClosePopup = () => {
        setIsPopupOpen(false); // 팝업 닫기
        setSelectedEvent(null); // 선택된 일정 초기화
    };

    // 일정 삭제
    const handleDeleteEvent = async () => {
        if (window.confirm(`'${selectedEvent.title}' 일정을 삭제하시겠습니까?`)) {
            try {
                const response = await axios.delete(
                    "https://heimsunback-production.up.railway.app/farm/delete",
                    {
                        data: { id: selectedEvent.id },
                    }
                );
                if (response.data) {
                    fetchEvents(new Date()); // 삭제 후 이벤트 새로고침
                    handleClosePopup(); // 팝업 닫기
                }
            } catch (err) {
                console.error("Failed to delete event:", err);
            }
        }
    };

    return (
        <div className="calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                selectable={true}
                editable={true}
                eventClick={handleEventClick} // 이벤트 클릭 시 팝업 실행
                datesSet={handleDatesSet}
                eventContent={(eventInfo) => (
                    <div>
                        <b>{eventInfo.event.title}</b>
                        <p>{eventInfo.event.extendedProps.description}</p>
                    </div>
                )}
            />

            {/* 팝업창 */}
            {isPopupOpen && selectedEvent && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{selectedEvent.title}</h2>
                        <p>
                            <strong>시작:</strong> {selectedEvent.start}
                        </p>
                        <p>
                            <strong>종료:</strong> {selectedEvent.end}
                        </p>
                        <p>
                            <strong>설명:</strong> {selectedEvent.description}
                        </p>
                        {selectedEvent.upload && (
                            <div className="upload-preview">
                                {selectedEvent.upload.endsWith(".jpg") ||
                                selectedEvent.upload.endsWith(".png") ||
                                selectedEvent.upload.endsWith(".jpeg") ? (
                                    <img
                                        src={"https://heimsunback-production.up.railway.app"+selectedEvent.upload}
                                        alt="Event Upload"
                                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                                    />
                                ) : selectedEvent.upload.endsWith(".mp4") ||
                                  selectedEvent.upload.endsWith(".avi") ? (
                                    <video
                                        src={"https://heimsunback-production.up.railway.app"+selectedEvent.upload}
                                        controls
                                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                                    />
                                ) : (
                                    <p>지원하지 않는 파일 형식입니다.</p>
                                )}
                            </div>
                        )}
                        <button onClick={handleClosePopup}>닫기</button>
                        <button onClick={handleDeleteEvent}>삭제</button>
                    </div>
                </div>
            )}
        </div>
    );
}
