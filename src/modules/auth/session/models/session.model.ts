import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IDeviceInfo, ILocationInfo, ISessionMetadata } from "@root/shared/types/session-metadata.type";

@ObjectType()
export class LocationModel implements ILocationInfo {
  @Field(() => String)
  country!: string;

  @Field(() => String)
  city!: string;

  @Field(() => Number)
  latidute!: number;

  @Field(() => Number)
  longitude!: number;
}

@ObjectType()
export class DeviceModel implements IDeviceInfo {
  @Field(() => String)
  browser!: string;

  @Field(() => String)
  os!: string;

  @Field(() => String)
  type!: string;
}

@ObjectType()
export class SessionMetadataModel implements ISessionMetadata {
  @Field(() => LocationModel)
  location!: LocationModel;

  @Field(() => DeviceModel)
  device!: DeviceModel;

  @Field(() => String)
  ip!: string;
}

@ObjectType()
export class SessionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  createdAt!: string;

  @Field(() => SessionMetadataModel)
  metadata!: SessionMetadataModel;
}