import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GarageRequestService } from './garage-request.service';
import { GarageRequestStatusEnum } from './entities/garage-request.entity';
import { AuthHttpGuard } from '../auth/guards/auth-http.guard';

@Controller('garage-requests')
@UseGuards(AuthHttpGuard)
export class GarageRequestController {
  constructor(private readonly requestService: GarageRequestService) {}

  @Post(':garageId')
  create(
    @Request() req,
    @Param('garageId') garageId: string,
    @Body('description') description?: string,
  ) {
    return this.requestService.create(req.user.userId, garageId, description);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Get('user/me')
  findMyRequests(@Request() req) {
    return this.requestService.findByUser(req.user.userId);
  }

  @Get('admin/me')
  findMyGarageRequests(@Request() req) {
    return this.requestService.findByGarageAdmin(req.user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: GarageRequestStatusEnum,
  ) {
    return this.requestService.updateStatus(req.user.userId, id, status);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    console.log('Attempting to delete request:', {
      requestId: id,
      userId: req.user.userId,
    });
    return this.requestService.remove(req.user.userId, id);
  }

  @Delete('garage/:garageId/user/:userId')
  removeUserFromGarage(
    @Request() req,
    @Param('garageId') garageId: string,
    @Param('userId') userId: string,
    @Body('adminComment') adminComment?: string,
  ) {
    return this.requestService.removeUserFromGarage(
      req.user.userId,
      garageId,
      userId,
      adminComment,
    );
  }
}
