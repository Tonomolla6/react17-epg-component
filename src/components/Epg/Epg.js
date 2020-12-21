import React from 'react';
import './Epg.css';
import * as data from '../../data/epg.json';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonSlide, IonSlides } from '@ionic/react';
import uuid from 'react-uuid';

const slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 5
};

export default class Epg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            epg: data,
            selected: 0,
            playing: 59314
        };
    }

    convertSecondsToDate(seconds) {
        let date = new Date(0);
        date.setUTCSeconds(seconds);
        return {
            "day": date.toLocaleString("es-ES", {weekday: "long", day: "numeric"}),
            "time": date.toLocaleString("es-ES", {hour: '2-digit', minute: '2-digit'})};
    }

    processingData(data) {
        let processed = {};
        Object.values(data).map((element,index) => {
            let time = this.convertSecondsToDate(element.spa.start).day;
            if (processed[time])
                processed[time].push(element.spa);
            else {
                processed[time] = [];
                processed[time].push(element.spa);
            }
        });
        return processed;
    }

    render() {
        let program = Object.entries(this.processingData(this.state.epg.default.events));
        return (
            <div className="epg-structure">
                <div className="days">
                    {program.map((element,index) => (
                        <div onClick={() => this.setState({ selected: index })} className={this.state.selected === index ? "day active" : "day"} key={index}>{element[0]}{ element[1].map((e) => e.id ).indexOf(this.state.playing) >= 0 ? " (HOY)" : ""}</div>
                    ))}
                </div>

                <div className="programs">
                    <IonSlides key={uuid()} pager={false} options={slideOpts}>
                        {console.log(program[this.state.selected])}
                        {program[this.state.selected][1].map((element) => (
                            <IonSlide key={element.id}>
                                {console.log(this.state.playing === element.id ? program[this.state.selected][0] : "")}
                                <IonCard className={this.state.playing === element.id ? "card active" : "card"}>
                                    <IonCardHeader>
                                        <div className={this.state.playing === element.id ? "directo active" : "directo"}>⚫ Directo</div>
                                        <IonCardSubtitle>{this.convertSecondsToDate(element.start).time}</IonCardSubtitle>
                                        <IonCardTitle>{element.name}</IonCardTitle>
                                    </IonCardHeader>

                                    <IonCardContent>
                                        {element.ext ? ' :' + element.ext.text : ''}
                                    </IonCardContent>
                                </IonCard>
                            </IonSlide>
                        ))}
                    </IonSlides>
                </div>
            </div>
        )
    }
};