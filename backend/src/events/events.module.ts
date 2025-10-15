import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { RegistrationsModule } from 'src/registrations/registrations.module'; // Import RegistrationsModule

@Module({
  imports: [FavoritesModule, RegistrationsModule], // Add RegistrationsModule to imports
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
