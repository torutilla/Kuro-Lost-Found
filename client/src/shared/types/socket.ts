import type { PetClientToServerEvents, PetServerToClientEvents } from "@features/home/socketEvents/pets.events.ts";

export type ServerToClientEvents = PetServerToClientEvents;

export type ClientToServerEvents = PetClientToServerEvents;