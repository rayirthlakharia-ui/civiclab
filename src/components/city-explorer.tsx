"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Trees,
  Route,
  PencilRuler,
  Wallet,
  ArrowRight,
} from "lucide-react";
import type { City } from "@/lib/schemas";
import { SourceList } from "./shared";
import { OpinionComposer } from "./opinion-composer";
import { TeenMeetings, type TeenTopic } from "./teen-meetings";
import { Representatives } from "./representatives";
const serviceIcons = [Trees, PencilRuler, Route, Wallet];
export function CityExplorer({ cities }: { cities: City[] }) {
  const [active, setActive] = useState(cities[0].id);
  const [teenTopic, setTeenTopic] = useState<TeenTopic>();
  const city = cities.find((item) => item.id === active)!;
  return (
    <>
      <div className="city-selector">
        <span>
          <MapPin size={18} />
          YOUR COMMUNITY
        </span>
        <div className="segmented" aria-label="Select a city">
          {cities.map((item) => (
            <button
              key={item.id}
              aria-pressed={active === item.id}
              onClick={() => {
                setActive(item.id);
                setTeenTopic(undefined);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <span className="selector-note">
          Two cities. Plenty of ways to take part.
        </span>
      </div>
      <section className="city-banner">
        <div>
          <p className="eyebrow">{city.region}</p>
          <h2>Hello, {city.name}.</h2>
          <p>{city.description}</p>
        </div>
        <div className="city-skyline" aria-hidden="true">
          <Trees size={70} strokeWidth={1} />
          <Building2 size={115} strokeWidth={1} />
          <Trees size={50} strokeWidth={1} />
        </div>
      </section>
      <Representatives cityId={city.id} cityName={city.name} />
      {city.id === "san-ramon" && (
        <TeenMeetings
          onChoose={(topic) => {
            setTeenTopic(topic);
            setTimeout(
              () => document.getElementById("opinion-topic")?.focus(),
              0,
            );
          }}
        />
      )}
      <div className="city-layout">
        <div>
          <section className="city-roles">
            <p className="eyebrow">WHO DOES WHAT?</p>
            <h2>Your city, explained.</h2>
            <p>{city.government}</p>
            <div className="role-grid">
              {city.roles.map((role, index) => (
                <article className="role-card" key={role.title}>
                  <span className="role-number">0{index + 1}</span>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                </article>
              ))}
            </div>
            <a
              className="text-link"
              href={city.councilUrl}
              target="_blank"
              rel="noreferrer"
            >
              Meet your elected representatives <ArrowUpRight size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </section>
          <section className="services">
            <h3>Local decisions, everyday life.</h3>
            <div>
              {city.responsibilities.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <span key={service}>
                    <Icon size={20} />
                    {service}
                  </span>
                );
              })}
            </div>
          </section>
          <OpinionComposer
            key={`${city.id}-${teenTopic?.date}-${teenTopic?.item}`}
            city={city}
            teenTopic={teenTopic}
          />
          <SourceList sources={city.sources} reviewedAt={city.reviewedAt} />
        </div>
        <aside>
          <section className="meeting-card">
            <span className="feature-icon peach">
              <CalendarDays size={23} />
            </span>
            <p className="eyebrow">A SEAT IN THE ROOM</p>
            <h3>City council meetings</h3>
            <div className="meeting-topics">
              <h4>What’s on the agenda?</h4>
              <p>{city.meeting.agendaStatus}</p>
              <p className="fine-print">
                Checked {city.meeting.checkedAt}. This is a saved snapshot, not
                a live feed.
              </p>
              <a
                className="text-link"
                href={city.meeting.agendaUrl}
                target="_blank"
                rel="noreferrer"
              >
                Read meeting subjects <ArrowUpRight size={15} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p>
                Look for each item’s title, staff report, and proposed action. A
                meeting can cover several subjects.
              </p>
            </div>
            <p className="meeting-schedule">{city.meeting.schedule}</p>
            <p className="icon-line">
              <Clock3 size={16} />
              {city.meeting.time}
            </p>
            <p className="icon-line">
              <MapPin size={16} />
              {city.meeting.location}
            </p>
            <p className="fine-print">
              Regular schedule only. Dates, locations, and participation
              procedures can change. Check the official agenda before attending.
            </p>
            <a
              className="button primary"
              href={city.meeting.url}
              target="_blank"
              rel="noreferrer"
            >
              View official meeting info <ArrowUpRight size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </section>
          <section className="participation">
            <h3>
              <Users size={20} /> Your voice belongs here.
            </h3>
            <ol>
              {city.participation.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>
              <ArrowRight size={16} />
              Start by learning about one local issue.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
