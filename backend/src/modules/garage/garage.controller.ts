import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  Patch,
  Logger,
  Query,
} from '@nestjs/common';
import { GarageService } from './garage.service';
import { AuthHttpGuard } from 'src/modules/auth/guards/auth-http.guard';
import { CreateGarageDto } from './dto/create-garage.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GarageEntity } from './entities/garage.entity';
import { UpdateCameraSettingsDto } from './dto/update-camera-settings.dto';
import { UpdateGateSettingsDto } from './dto/update-gate-settings.dto';

@Controller('garages')
@UseGuards(AuthHttpGuard)
export class GarageController {
  private readonly logger = new Logger(GarageController.name);

  constructor(private readonly garageService: GarageService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createGarage(@Request() req, @Body() createGarageDto: CreateGarageDto) {
    const admin = await this.garageService.findUserById(req.user.userId);
    return this.garageService.createGarage({
      ...createGarageDto,
      admin,
    });
  }

  @Get('my')
  async getMyGarages(@Request() req) {
    return this.garageService.findMyGarages(req.user.userId);
  }

  @Get('available')
  async getAvailableGarages() {
    return this.garageService.findAvailableGarages();
  }

  @Get('access-requests')
  async getAccessRequests(@Request() req) {
    return this.garageService.findAccessRequests(req.user.userId);
  }

  @Post('access-requests')
  async createAccessRequest(
    @Request() req,
    @Body() body: { garageId: string },
  ) {
    return this.garageService.createAccessRequest(
      req.user.userId,
      body.garageId,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteGarage(@Request() req, @Param('id') id: string) {
    return this.garageService.deleteGarage(req.user.userId, id);
  }

  @Patch(':id/camera')
  async updateCameraSettings(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCameraSettingsDto: UpdateCameraSettingsDto,
  ) {
    this.logger.log(
      `Updating camera settings for garage ${id} by user ${req.user.userId}`,
    );
    this.logger.log('Request body:', updateCameraSettingsDto);

    const result = await this.garageService.updateCameraSettings(
      req.user.userId,
      id,
      updateCameraSettingsDto,
    );

    this.logger.log('Camera settings updated successfully:', {
      garageId: result.garageId,
      cameraIp: result.camera?.ip,
      cameraPort: result.camera?.streamPort,
    });

    return result;
  }

  @Patch(':id/gate')
  async updateGateSettings(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGateSettingsDto: UpdateGateSettingsDto,
  ) {
    this.logger.log(
      `Updating gate settings for garage ${id} by user ${req.user.userId}`,
    );
    this.logger.log('Request body:', updateGateSettingsDto);

    return this.garageService.updateGateSettings(
      req.user.userId,
      id,
      updateGateSettingsDto,
    );
  }

  @Patch(':garageId/gate/toggle')
  @UseGuards(AuthHttpGuard)
  async toggleGate(
    @Param('garageId') garageId: string,
    @Request() req: any,
  ): Promise<GarageEntity> {
    console.log('Controller: toggleGate called with:', {
      garageId,
      userId: req.user.userId,
    });

    const result = await this.garageService.toggleGate(
      req.user.userId,
      garageId,
    );

    console.log('Controller: toggleGate result:', {
      garageId: result.garageId,
      gateStatus: result.gate?.status,
    });

    return result;
  }

  @Get(':id/access-logs')
  async getGarageAccessLogs(
    @Request() req,
    @Param('id') garageId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    this.logger.log('Getting access logs for garage:', {
      garageId,
      userId: req.user.userId,
      page,
      limit,
    });

    try {
      const result = await this.garageService.getGarageAccessLogs(
        garageId,
        page,
        limit,
        req.user.userId,
      );

      this.logger.log('Successfully retrieved access logs:', {
        garageId,
        userId: req.user.userId,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });

      return result;
    } catch (error) {
      this.logger.error('Error in getGarageAccessLogs:', {
        garageId,
        userId: req.user.userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
