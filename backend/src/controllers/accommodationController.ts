import type { Request, Response } from "express";
import { Accommodation } from "../model/Accommodation";
import { Guest } from "../model/Guest";

function sanitizeText(value: unknown, maxLength = 500) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function parseCount(value: unknown) {
  const count = Number(value || 0);
  return Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;
}

function parseType(value: unknown) {
  return value === "suite" ? "suite" : "common";
}

function parseStatus(value: unknown) {
  return value === "unavailable" ? "unavailable" : "available";
}

function parseGuestIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

async function validateGuestIds(guestIds: string[]) {
  if (guestIds.length === 0) {
    return [];
  }

  const guests = await Guest.find({ _id: { $in: guestIds } });

  if (guests.length !== guestIds.length) {
    return null;
  }

  return guests;
}

function serializeAccommodation(accommodation: any) {
  const assignedGuests = Array.isArray(accommodation.guestIds)
    ? accommodation.guestIds.map((guest: any) => ({
        _id: String(guest._id),
        name: guest.name,
        status: guest.status,
        isChild: guest.isChild,
        guestType: guest.guestType,
      }))
    : [];

  return {
    _id: String(accommodation._id),
    name: accommodation.name,
    type: accommodation.type,
    status: accommodation.status,
    bedDescription: accommodation.bedDescription || "",
    fixedBeds: Number(accommodation.fixedBeds || 0),
    extraMattresses: Number(accommodation.extraMattresses || 0),
    extraPlaces: Number(accommodation.extraPlaces || 0),
    notes: accommodation.notes || "",
    guestIds: assignedGuests.map((guest: any) => guest._id),
    assignedGuests,
    createdAt: accommodation.createdAt,
    updatedAt: accommodation.updatedAt,
  };
}

function buildSummary(accommodations: any[]) {
  return accommodations.reduce(
    (acc, accommodation) => {
      const fixedBeds = Number(accommodation.fixedBeds || 0);
      const extraMattresses = Number(accommodation.extraMattresses || 0);
      const extraPlaces = Number(accommodation.extraPlaces || 0);
      const capacity = fixedBeds + extraMattresses + extraPlaces;
      const occupied = Array.isArray(accommodation.guestIds) ? accommodation.guestIds.length : 0;

      acc.totalRooms += 1;
      acc.fixedBeds += fixedBeds;
      acc.extraMattresses += extraMattresses;
      acc.extraPlaces += extraPlaces;
      acc.totalCapacity += capacity;
      acc.occupiedPlaces += occupied;

      if (accommodation.type === "suite") {
        acc.suites += 1;
      } else {
        acc.commonRooms += 1;
      }

      if (accommodation.status === "unavailable") {
        acc.unavailable += 1;
      }

      return acc;
    },
    {
      totalRooms: 0,
      suites: 0,
      commonRooms: 0,
      unavailable: 0,
      fixedBeds: 0,
      extraMattresses: 0,
      extraPlaces: 0,
      totalCapacity: 0,
      occupiedPlaces: 0,
    }
  );
}

export async function getAdminAccommodations(_req: Request, res: Response) {
  try {
    const [accommodations, guests] = await Promise.all([
      Accommodation.find()
        .populate("guestIds", "name status isChild guestType")
        .sort({ createdAt: -1 }),
      Guest.find().sort({ name: 1 }),
    ]);

    const serialized = accommodations.map(serializeAccommodation);
    const summary = buildSummary(accommodations);

    return res.json({
      accommodations: serialized,
      guests: guests.map((guest) => ({
        _id: String(guest._id),
        name: guest.name,
        status: guest.status,
        isChild: guest.isChild,
        guestType: guest.guestType,
      })),
      summary: {
        ...summary,
        availablePlaces: Math.max(summary.totalCapacity - summary.occupiedPlaces, 0),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar hospedagens:", error);
    return res.status(500).json({ message: "Erro ao buscar hospedagens." });
  }
}

export async function createAccommodation(req: Request, res: Response) {
  try {
    const name = sanitizeText(req.body.name, 140);
    const guestIds = parseGuestIds(req.body.guestIds);

    if (!name) {
      return res.status(400).json({ message: "Nome da hospedagem e obrigatorio." });
    }

    const guests = await validateGuestIds(guestIds);
    if (guests === null) {
      return res.status(400).json({ message: "Alguns convidados selecionados nao foram encontrados." });
    }

    const accommodation = await Accommodation.create({
      name,
      type: parseType(req.body.type),
      status: parseStatus(req.body.status),
      bedDescription: sanitizeText(req.body.bedDescription, 280),
      fixedBeds: parseCount(req.body.fixedBeds),
      extraMattresses: parseCount(req.body.extraMattresses),
      extraPlaces: parseCount(req.body.extraPlaces),
      notes: sanitizeText(req.body.notes, 800),
      guestIds,
    });

    await accommodation.populate("guestIds", "name status isChild guestType");

    return res.status(201).json(serializeAccommodation(accommodation));
  } catch (error) {
    console.error("Erro ao criar hospedagem:", error);
    return res.status(500).json({ message: "Erro ao criar hospedagem." });
  }
}

export async function updateAccommodation(req: Request, res: Response) {
  try {
    const name = sanitizeText(req.body.name, 140);
    const guestIds = parseGuestIds(req.body.guestIds);

    if (!name) {
      return res.status(400).json({ message: "Nome da hospedagem e obrigatorio." });
    }

    const guests = await validateGuestIds(guestIds);
    if (guests === null) {
      return res.status(400).json({ message: "Alguns convidados selecionados nao foram encontrados." });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type: parseType(req.body.type),
        status: parseStatus(req.body.status),
        bedDescription: sanitizeText(req.body.bedDescription, 280),
        fixedBeds: parseCount(req.body.fixedBeds),
        extraMattresses: parseCount(req.body.extraMattresses),
        extraPlaces: parseCount(req.body.extraPlaces),
        notes: sanitizeText(req.body.notes, 800),
        guestIds,
      },
      { new: true }
    ).populate("guestIds", "name status isChild guestType");

    if (!accommodation) {
      return res.status(404).json({ message: "Hospedagem nao encontrada." });
    }

    return res.json(serializeAccommodation(accommodation));
  } catch (error) {
    console.error("Erro ao atualizar hospedagem:", error);
    return res.status(500).json({ message: "Erro ao atualizar hospedagem." });
  }
}

export async function deleteAccommodation(req: Request, res: Response) {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Hospedagem nao encontrada." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir hospedagem:", error);
    return res.status(500).json({ message: "Erro ao excluir hospedagem." });
  }
}
