import { getAllMembers, getMemberByEmail } from 'api';
import { AdminMemberUpdate, Member } from 'models/apiModels';
import { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import Modal from 'components/molecules/modal/Modal';
import TextField from 'components/atoms/textfield/Textfield';
import useForm from 'hooks/useForm';
import styles from './memberTable.module.scss';
import Select from 'components/atoms/select/Select';
import { adminUpdateMember, deleteMember } from 'api/admin';
import { RoleOptions } from 'contexts/authProvider';
import { useToast } from 'hooks/useToast';
import { isDeepEqual } from 'utils/general';
import Icon from 'components/atoms/icons/icon';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import useFetchUpdate from 'hooks/useFetchUpdate';
import { Fragment, StrictMode } from "react";
import {
    emailValidator,
    nameValidator,
    notRequiredPhoneValidator,
} from 'utils/validators';
import useModal from 'hooks/useModal';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    ChakraProvider,
    Code,
    extendTheme,
    Heading,
    IconButton,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react'

const MemberTable = () => {
    const [members, setMembers] = useState<Array<Member> | undefined>();
    const [selectedMember, setSelected] = useState<Member | undefined>();
    const [initialValues, setInitialValues] = useState<AdminMemberUpdate>();
    const [error, setError] = useState<undefined | string>();

    const { addToast } = useToast();
    const { isOpen, onOpen, onClose } = useModal();
    const {
        isOpen: isOpenDeleteModal,
        onOpen: openDeleteModal,
        onClose: closeDeleteModal,
    } = useModal();

    const validators = {
        realName: nameValidator,
        email: emailValidator,
        phone: notRequiredPhoneValidator,
    };

    const submit = async () => {
        try {
            if (hasErrors) {
                return;
            }

            const id = fields['id'].value;
            const member: AdminMemberUpdate = {
                realName: fields['realName'].value,
                email: fields['email'].value,
                classof: fields['classof'].value,
                phone: fields['phone'].value,
                status: fields['status'].value,
                role: fields['role'].value as RoleOptions,
                penalty: +fields['penalty'].value,
            };
            if (!isDeepEqual(member, initialValues)) {
                await adminUpdateMember(id, member);
                setShouldFetch(true);
                onClose();
                addToast({
                    title: 'Suksess',
                    status: 'success',
                    description: `${member.realName} er oppdatert`,
                });
                return;
            }
            setError('Minst et felt må endres');
        } catch (error) {
            switch (error.statusCode) {
                case 403:
                    addToast({
                        title: 'Error',
                        status: 'error',
                        description:
                            'Admin har ikke rettigheter til å oppdatere andre admin brukere',
                    });
                    return;
                default:
                    addToast({
                        title: 'Error',
                        status: 'error',
                        description: 'En feil skjedde ved oppdatering av medlem',
                    });
            }
        }
    };

    const fetchMembers = async () => {
        try {
            const members = await getAllMembers();
            setMembers(members);
        } catch (error) {
            addToast({
                title: 'Error',
                status: 'error',
                description: 'En feil skjedde ved innhenting av alle medlemmer',
            });
        }
    };

    const openDeleteColumn = (email: string) => {
        const selected = members?.find((mem) => {
            return mem.email === email;
        });
        setSelected(selected);
        openDeleteModal();
    };

    const adminDeleteMember = async () => {
        try {
            if (!selectedMember) {
                return;
            }
            const response = await getMemberByEmail(selectedMember.email);
            await deleteMember(response['id']);
            setShouldFetch(true);
            addToast({
                title: 'Suksess',
                status: 'success',
                description: `${selectedMember?.realName} er slettet`,
            });
        } catch (error) {
            switch (error.statusCode) {
                case 403:
                    addToast({
                        title: 'Error',
                        status: 'error',
                        description: `Admin har ikke mulighet til å slettet andre admin brukere`,
                    });
                    break;

                default:
                    addToast({
                        title: 'Error',
                        status: 'error',
                        description: `Unexpected error when deleting ${selectedMember?.realName}`,
                    });
            }
        }
        closeDeleteModal();
    };

    const AccordianIconButton = () => (
        <AccordionButton as={IconButton} icon={<AccordionIcon />} px="0" minW="0" />
    );

    //   const accordianMemberList = () => {
    //     return(
    //         <Accordion allowMultiple>
    //             <TableContainer>
    //                 <Table variant="simple">
    //                       <Thead>
    //                           <Tr>
    //                               <Th>More</Th>
    //                               <Th>Name</Th>
    //                               <Th>E-mail</Th>
    //                               <Th>E-mail</Th>
    //                               <Th>Penalty</Th>
    //                               <Th>Role</Th>
    //                               <Th>Edit</Th>
    //                               <Th>Delete</Th>
    //                           </Tr>
    //                       </Thead>
    //                     <Tbody>
    //                         <AccordionItem as={Fragment}>
    //                             <Tr>
    //                                 <Td>
    //                                     <AccordionIcon/>
    //                                 </Td>

    //                             </Tr>
    //                             <Tr>
    //                               <Td>Email</Td>
    //                               <Td>{member.email}</Td>
    //                             </Tr>
    //                             <Tr>
    //                               <Td>Class of</Td>
    //                               <Td>{member.classof}</Td>
    //                             </Tr>
    //                             <Tr>
    //                               <Td>Status</Td>
    //                               <Td>{member.status}</Td>
    //                             </Tr>
    //                             <Tr>
    //                               <Td>Penalty</Td>
    //                               <Td>{member.penalty}</Td>
    //                             </Tr>
    //                             <Tr>
    //                               <Td>Role</Td>
    //                               <Td>{member.role}</Td>
    //                             </Tr>

    //                         </AccordionItem>
    //                     </Tbody>
    //                 </Table>
    //             </TableContainer>
    //         </Accordion>
    //     );
    //   };

    const accordianMemberList = () => {
        return (
            <Accordion allowMultiple color="red">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th id="Th">More</Th>
                                <Th>Name</Th>
                                <Th>E-mail</Th>
                                <Th>Class of</Th>
                                <Th>Status</Th>
                                <Th>Penalty</Th>
                                <Th>Role</Th>
                                <Th>Edit</Th>
                                <Th>Delete</Th>
                            </Tr>
                        </Thead>
                {members && members.map((member, index) => (
                        <Tbody>
                         <TableContainer>
                            <AccordionItem key={index}>
                                <Tr>
                                <AccordionButton>
                                    <AccordionIcon />
                                </AccordionButton>
                                <Th>{member.realName}</Th>
                                <Th>{member.email}</Th>
                                <Th>{member.status}</Th>
                                <Th>{member.role}</Th>
                                </Tr>
                                <AccordionPanel pb={0}>
                                        <Tr>
                                            <Td>Email</Td>
                                            <Td>{member.email}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Class of</Td>
                                            <Td>{member.classof}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Status</Td>
                                            <Td>{member.status}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Penalty</Td>
                                            <Td>{member.penalty}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Role</Td>
                                            <Td>{member.role}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Edit</Td>
                                            <Td>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        onOpen();
                                                        const updateValues: AdminMemberUpdate = {
                                                            realName: member.realName,
                                                            email: member.email,
                                                            classof: member.classof,
                                                            phone: member.phone,
                                                            status: member.status,
                                                            role: member.role,
                                                            penalty: member.penalty,
                                                        };
                                                        resetForm(updateValues as any);
                                                        setInitialValues(updateValues);
                                                    }}>
                                                    Edit
                                                </Button>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Delete</Td>
                                            <Td>
                                                <Icon
                                                    size={2}
                                                    type="trash"
                                                    onClick={() => openDeleteColumn(member.email)}
                                                />
                                            </Td>
                                        </Tr>
                                </AccordionPanel>
                            </AccordionItem>
                         </TableContainer>
                        </Tbody>
                ))
            }
            </Table>
            </Accordion >
        );
    };

    //   const columns: ColumnDefinitionType<Member, keyof Member>[] = [
    //     { cell: 'email', header: 'Email', type: 'string' },
    //     { cell: 'classof', header: 'Class of', type: 'number' },
    //     { cell: 'status', header: 'Status', type: 'string' },
    //     { cell: 'penalty', header: 'Penalty', type: 'number' },
    //     { cell: 'role', header: 'Role', type: 'string' },
    //     {
    //       cell: (cellValues) => {
    //         return (
    //           <Button
    //             variant="secondary"
    //             onClick={() => {
    //               onOpen();
    //               const { role, email, status, classof, realName, phone, penalty } =
    //                 cellValues;
    //               const updateValues: AdminMemberUpdate = {
    //                 role,
    //                 email,
    //                 status,
    //                 classof,
    //                 realName,
    //                 phone,
    //                 penalty,
    //               };
    //               resetForm(cellValues as any);
    //               setInitialValues(updateValues);
    //             }}>
    //             Edit
    //           </Button>
    //         );
    //       },
    //       header: 'Edit',
    //     },
    //     {
    //       cell: (cellValues) => {
    //         const { email } = cellValues;
    //         return (
    //           <>
    //             <Icon
    //               size={2}
    //               type="trash"
    //               onClick={() => {
    //                 openDeleteColumn(email);
    //               }}
    //             />
    //           </>
    //         );
    //       },
    //       header: 'Delete',
    //     },
    //   ];

    const {
        fields,
        hasErrors,
        onSubmitEvent,
        onFieldChange,
        onControlledFieldChange,
        resetForm,
    } = useForm({
        onSubmit: submit,
        validators: validators,
    });

    const { setShouldFetch } = useFetchUpdate(fetchMembers);

    useEffect(() => {
        setShouldFetch(true);
    }, [setShouldFetch]);

    useEffect(() => {
        setError(undefined);
    }, [isOpen]);

    // TODO edit input validation
    return (
        <div className={styles.form}>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                minWidth={45}
                title="Endre bruker">
                <form onSubmit={onSubmitEvent}>
                    <div className={styles.general}>
                        <TextField
                            minWidth={30}
                            label="Navn"
                            name={'realName'}
                            value={fields['realName']?.value ?? ''}
                            onChange={onFieldChange}
                            error={fields['realName'].error}
                        />
                        <br />
                        <TextField
                            minWidth={30}
                            name={'email'}
                            value={fields['email']?.value ?? ''}
                            onChange={onFieldChange}
                            label="Email"
                            error={fields['email'].error}
                        />
                        <br />
                        <TextField
                            minWidth={30}
                            name="phone"
                            value={fields['phone']?.value ?? ''}
                            onChange={onFieldChange}
                            label="Phone"
                            error={fields['phone'].error}
                        />
                        <br />
                        <TextField
                            minWidth={30}
                            name="classof"
                            value={fields['classof']?.value ?? ''}
                            onChange={onFieldChange}
                            label="Class of"
                        />
                        <br />
                        <TextField
                            minWidth={30}
                            name="penalty"
                            value={fields['penalty']?.value ?? ''}
                            onChange={onFieldChange}
                            label="Penalty"
                        />
                        <br />
                        <Select
                            name="status"
                            value={fields['status']?.value}
                            onChange={onControlledFieldChange}
                            minWidth={26.5}
                            items={[
                                {
                                    key: 'inactive',
                                    label: 'Inactive',
                                    value: 'INACTIVE',
                                },
                                {
                                    key: 'active',
                                    label: 'Active',
                                    value: 'ACTIVE',
                                },
                            ]}
                            label="Status"
                        />
                        <br />
                        <Select
                            name="role"
                            value={fields['role']?.value}
                            onChange={onControlledFieldChange}
                            minWidth={26.5}
                            items={[
                                {
                                    key: 'admin',
                                    label: 'Admin',
                                    value: 'admin',
                                },
                                {
                                    key: 'member',
                                    label: 'Member',
                                    value: 'member',
                                },
                            ]}
                            label="Role"
                        />
                        {error !== undefined ? <p>{error}</p> : <br />}
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                title={`Er du sikker på at du vil slette ${selectedMember?.realName}?`}
                isOpen={isOpenDeleteModal}
                onClose={closeDeleteModal}
                minWidth={45}>
                <ConfirmationBox
                    onAccept={adminDeleteMember}
                    onDecline={closeDeleteModal}
                />
            </Modal>
            {members ? (
                accordianMemberList()
            ) : (
                <h1>No members</h1>
            )}
        </div>
    );
};

export default MemberTable;
