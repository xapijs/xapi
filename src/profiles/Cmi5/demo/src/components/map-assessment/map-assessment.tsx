import { Component, h, Event, EventEmitter } from "@stencil/core";
import L from "leaflet";

@Component({
  tag: "map-assessment",
  styleUrl: "map-assessment.css"
})
export class MapAssessment {
  @Event() location: EventEmitter;

  componentDidLoad() {
    const map = L.map("map");
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
    map.setView([53.756898, -4.501819], 5);
    const plymouth = L.marker([50.375442, -4.142584]).addTo(map);
    plymouth.on("click", () => this.location.emit("(53.756898, -4.501819)"));
    const london = L.marker([51.507242, -0.127599]).addTo(map);
    london.on("click", () => this.location.emit("(51.507242, -0.127599)"));
    const edinburgh = L.marker([55.953261, -3.188275]).addTo(map);
    edinburgh.on("click", () => this.location.emit("(55.953261, -3.188275)"));
  }

  render() {
    return (
      <div id="map"></div>
    );
  }
}
