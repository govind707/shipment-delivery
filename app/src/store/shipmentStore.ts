import { create } from "zustand";

type Address = {
  readonly latitude: number;
  readonly longitude: number;
  readonly home: string;
};

type TrackShipmentDetails = {
  readonly active: boolean;
  readonly destinationAddress: Address;
  readonly pickUpPointAddress: Address;
  readonly shipmentId: string;
  readonly typeOfGoods: string;
  readonly weight: string;
  readonly dimensions: string;
  readonly pickUpDate: Date;
  readonly status?: string;
  readonly deliveredAt?: Date;
};

type ShipmentWithUserId = TrackShipmentDetails & { readonly userId: string };

type UserReleventShipments = {
  readonly userId: string;
  readonly shipments: TrackShipmentDetails[];
};

type UpdateShipmentHistory = {
  readonly userId: string;
  readonly shipment: TrackShipmentDetails;
};

type Store = {
  readonly shipmentHistory: UserReleventShipments[];
  readonly setShipmentHistory: (value: UpdateShipmentHistory) => void;
  readonly getAllShipmentsByUserId: (userId: string) => TrackShipmentDetails[];
  readonly updateShipmentStatus: (
    userId: string,
    shipmentId: string,
    status: string
  ) => void;
  readonly getAllRequestedPickups: () => ShipmentWithUserId[];
};

export const useShipmentStore = create<Store>((set, get) => ({
  shipmentHistory: [],
  setShipmentHistory: ({ userId, shipment }: UpdateShipmentHistory) => {
    set((state) => {
      const findUser = state.shipmentHistory.find(
        (pre) => pre.userId === userId
      );

      if (findUser) {
        return {
          shipmentHistory: [
            ...state.shipmentHistory.filter((_) => _.userId !== userId),
            { userId, shipments: [...findUser.shipments, shipment] },
          ],
        };
      } else {
        return {
          shipmentHistory: [
            ...state.shipmentHistory,
            { userId, shipments: [shipment] },
          ],
        };
      }
    });
  },
  getAllShipmentsByUserId: (userId: string) => {
    const findUser = get().shipmentHistory.find(
      (userShipments) => userShipments.userId === userId
    );
    return findUser?.shipments ?? [];
  },
  updateShipmentStatus: (
    userId: string,
    shipmentId: string,
    status: string
  ) => {
    set((state) => {
      const findUser = state.shipmentHistory.find(
        (pre) => pre.userId === userId
      );

      if (findUser) {
        return {
          shipmentHistory: [
            ...state.shipmentHistory.filter((_) => _.userId !== userId),
            {
              userId,
              shipments: [
                ...findUser.shipments.map((_) => {
                  if (_.shipmentId === shipmentId) {
                    return {
                      ..._,
                      status,
                      deliveredAt:
                        status === "delivered" ? new Date() : undefined,
                    };
                  }
                  return _;
                }),
              ],
            },
          ],
        };
      }
    });
  },
  getAllRequestedPickups: () => {
    const requiredShipments = get().shipmentHistory.reduce(
      (acc: ShipmentWithUserId[], history) => {
        for (let i = 0; i < history.shipments.length; i++) {
          if (history.shipments[i].status !== "delivered") {
            acc.push({ ...history.shipments[i], userId: history.userId });
          }
        }

        return acc;
      },
      []
    );

    return requiredShipments;
  },
}));
