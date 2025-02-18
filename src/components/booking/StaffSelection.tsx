'use client';

import { useBooking } from '@/contexts/BookingContext';
import { employees } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface StaffSelectionProps {
  onNext: () => void;
}

export default function StaffSelection({ onNext }: StaffSelectionProps) {
  const { state, dispatch } = useBooking();

  const handleSelect = (employee: Employee) => {
    dispatch({ type: 'SELECT_EMPLOYEE', payload: employee });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wählen Sie einen Mitarbeiter</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                state.selectedEmployee?.id === employee.id && 'ring-2 ring-primary'
              }`}
              onClick={() => handleSelect(employee)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{employee.name}</h3>
                    <p className="text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{employee.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {employee.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}