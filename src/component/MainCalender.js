import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // 사용자 상호작용 플러그인

export default function MainCalendar() {
    const [events, setEvents] = useState([
        
    ]);
    // 데이터형식
    // { id: '1', title: '이벤트 1', start: '2025-01-07T09:00:00', end: '2025-01-07T11:00:00', description: '첫 번째 이벤트' },
    // { id: '2', title: '이벤트 2', start: '2025-01-08T14:00:00', end: '2025-01-08T16:00:00', description: '두 번째 이벤트' },

    // 일정 추가
    const handleDateSelect = (selectInfo) => {
        const title = prompt('새로운 일정 제목을 입력하세요:');
        const description = prompt('일정의 간단한 내용을 입력하세요:');
        const start = prompt('시작 날짜와 시간을 입력하세요 (예: 2025-01-10T09:00):', selectInfo.startStr);
        const end = prompt('종료 날짜와 시간을 입력하세요 (예: 2025-01-10T11:00):', selectInfo.endStr);

        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // 선택된 상태 초기화

        if (title && start && end) {
            const newEvent = {
                id: String(events.length + 1),
                title,
                description,
                start,
                end,
                allDay: selectInfo.allDay,
            };
            setEvents([...events, newEvent]);
        }
    };

    // 일정 삭제
    const handleEventClick = (clickInfo) => {
        if (window.confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
            setEvents(events.filter(event => event.id !== clickInfo.event.id));
        }
    };

    // 일정 수정
    const handleEventChange = (changeInfo) => {
        const updatedEvents = events.map(event => {
            if (event.id === changeInfo.event.id) {
                return {
                    ...event,
                    start: changeInfo.event.startStr,
                    end: changeInfo.event.endStr,
                };
            }
            return event;
        });
        setEvents(updatedEvents);
    };

    return (
        <div className="calender">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                selectable={true} // 날짜 선택 가능
                select={handleDateSelect} // 날짜 선택 시 실행
                eventClick={handleEventClick} // 이벤트 클릭 시 실행
                editable={true} // 드래그 및 수정 가능
                eventChange={handleEventChange} // 이벤트 수정 시 실행
                eventContent={(eventInfo) => (
                    <div>
                        <b>{eventInfo.event.title}</b>
                        <p>{eventInfo.event.extendedProps.description}</p>
                    </div>
                )} // 일정 설명 표시
            />
        </div>
    );
}
