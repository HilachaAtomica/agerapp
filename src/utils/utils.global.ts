import {createRef} from 'react';
import {AppointmentInformationModalMethods} from '../components/modals/appointment-information-modal';
import {Appointment} from '../models/appointments';

export const appointmentInformationModalRef =
  createRef<AppointmentInformationModalMethods>();

export const openAppointmentInformationModal = (appointment: Appointment) => {
  appointmentInformationModalRef?.current?.open(appointment);
};
