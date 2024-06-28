const helper = require("../../helper/helper");
const news = require("../../models/news");
const salesforce = require("../../models/salesForce");
const users = require("../../models/users");
const doctor_prescription = require("../../models/doctor_precription");
const { Validator } = require('node-input-validator');
var jsforce = require('jsforce');
var cron = require('node-cron');

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const year = yesterday.getFullYear();
const month = String(yesterday.getMonth() + 1).padStart(2, '0');
const day = String(yesterday.getDate()).padStart(2, '0');
const today_year = today.getFullYear();
const today_month = String(today.getMonth() + 1).padStart(2, '0'); 
const today_day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}T00:00:00.000+0000`;
const formattedDateToday = `${today_year}-${today_month}-${today_day}T00:00:00.000+0000`;

//get all patients cron
cron.schedule('10 0 * * *', () => {
    // console.log('running a task every minute');
    try {
        
       
        var conn = new jsforce.Connection();
        conn.login('ajayceo1985@gmail.com', 'Msdjh23xbs@EwxGB4rMORi3dGdnJJjKSGxN4Oh', function(err, res) {
            if (err) {
                return console.error('Login error:', err);
            }
            fetchAllAccounts();
        });

        function fetchAllAccounts() {
            let records = [];
            let query = conn.query(`
            SELECT Id, AccountId, FirstName, LastName, Email, Phone, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, CreatedDate, LastModifiedDate, OwnerId, CPF__c, Data_de_Nascimento__c, PhotoUrl
            FROM Contact 
            WHERE CreatedDate >= ${formattedDate} AND CreatedDate < ${formattedDateToday}
        `); // Account  Contact 
        // let query = conn.query(`
        //     SELECT Id, AccountId, FirstName, LastName, Email, Phone, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, CreatedDate, LastModifiedDate, OwnerId, CPF__c, Data_de_Nascimento__c, PhotoUrl
        //     FROM Contact 
        // `); // Account  Contact

            query
                .on("record", function(record) {
                    records.push(record);
                })
                .on("end",async function() {
                    if(records.length > 0){
                        for(let allRecords of records){
                            await users.create({
                                role : 2,
                                firstName : allRecords.FirstName,
                                lastName : allRecords.LastName,
                                email : allRecords.Email,
                                dob : allRecords.Data_de_Nascimento__c,
                                phoneNumber : allRecords.Phone,
                                cpfId : allRecords.CPF__c,
                                address : allRecords.MailingStreet,
                                city : allRecords.MailingCity,
                                state : allRecords.MailingState,
                                country : allRecords.MailingCountry,
                                postalCode : allRecords.MailingPostalCode,
                                image : allRecords.PhotoUrl,
                            });
                        }
                    }
                    return helper.success(res, "Account details fetched successfully", records);
                })
                .on("error", function(err) {
                    console.error("Query error:", err);
                    return helper.error(res, "An error occurred while fetching account details.");
                })
                .run({ autoFetch: true, maxFetch: 100000 }); // Adjust maxFetch if needed
        }
    } catch (error) {
        console.log(error);
        return helper.failed(res, error);
    }
});


//get all doctors cron
cron.schedule('10 2 * * *', () => {
    try {
        var conn = new jsforce.Connection();
        conn.login('ajayceo1985@gmail.com', 'Msdjh23xbs@EwxGB4rMORi3dGdnJJjKSGxN4Oh', function(err, res) {
            if (err) {
                return console.error('Login error:', err);
            }
            fetchAllAccounts();
        });

        function fetchAllAccounts() {
            let records = [];
            let query = conn.query(`
            SELECT Id, Name, PhotoUrl, CreatedDate, LastModifiedDate, Email_do_consultorio__c, Especialidade__c,Cidade_del__c, Endereco_comercial_Visita__c, Telefone_Consult_rio__c
            FROM Account 
            WHERE CreatedDate >= ${formattedDate} AND CreatedDate < ${formattedDateToday}
        `); // Account  Contact
        // let query = conn.query(`
        //     SELECT Id, Name, PhotoUrl, CreatedDate, LastModifiedDate, Email_do_consultorio__c, Especialidade__c,Cidade_del__c, Endereco_comercial_Visita__c, Telefone_Consult_rio__c
        //     FROM Account 
        // `); // Account  Contact

            query
                .on("record", function(record) {
                    records.push(record);
                })
                .on("end",async function() {
                    if(records.length > 0){
                        for(let allRecords of records){
                            await users.create({
                                role : 3,
                                firstName : allRecords.Name,
                                email : allRecords.Email_do_consultorio__c,
                                phoneNumber : allRecords.Telefone_Consult_rio__c,
                                doctorId : allRecords.Id,
                                address : allRecords.Endereco_comercial_Visita__c,
                                city : allRecords.Cidade_del__c,
                                image : allRecords.PhotoUrl,
                                categoryName : allRecords.Especialidade__c,
                            });
                        }
                    }
                    return helper.success(res, "Account details fetched successfully", records);
                })
                .on("error", function(err) {
                    console.error("Query error:", err);
                    return helper.error(res, "An error occurred while fetching account details.");
                })
                .run({ autoFetch: true, maxFetch: 100000 }); // Adjust maxFetch if needed
        }
    } catch (error) {
        console.log(error);
        return helper.failed(res, error);
    }
  });

module.exports = {

    homePage: async (req, res) => {
        try {
            if(req.params.type == 1){
                let get_news = await news.find().sort({ createdAt: "desc" });
                return helper.success(res, "News listing fetch successfully",get_news);

            }else if(req.params.type == 2){
                let get_prescription = await doctor_prescription.find({
                    doctorId : req.user._id
                }).sort({ createdAt: "desc" });
                return helper.success(res, "Prescription fetch successfully",get_prescription);
            }else{
                return helper.failed(res, "Invalid type!");
            }
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    newsDetails: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                newsId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const news_details = await news.findOne({
                _id: req.body.newsId
            });
            
            return helper.success(res, "News details fetch successfully",news_details);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    // slaesforceData:async(req,res) => {
    //     try {
    //         const conn = new jsforce.Connection({
    //             loginUrl: 'https://login.salesforce.com'
    //         });
    
    //         conn.login('ajayceo1985@gmail.com', 'Msdjh23xbs@EwxGB4rMORi3dGdnJJjKSGxN4Oh', async (err, userInfo) => {
    //             if (err) {
    //                 console.error('Login error:', err);
    //                 return helper.error(res, 'Login to Salesforce failed');
    //             }
    
    //             // console.log('User ID: ' + userInfo.id);
    //             // console.log('Org ID: ' + userInfo.organizationId);
    
    //             try {
    //                 const describeResult = await conn.describeGlobal();
    //                 // console.log('Num of SObjects: ' + describeResult.sobjects.length);
    
    //                 const sObjectNames = describeResult.sobjects.map(sobject => sobject.name);
    //                 // console.log('Available SObjects:', sObjectNames);
    
    //                 const objectName = 'Follow_up_de_Paciente__c';
                    
    //                 if (!sObjectNames.includes(objectName)) {
    //                     console.error(`Custom object '${objectName}' not found.`);
    //                     return helper.error(res, `Custom object '${objectName}' not found.`);
    //                 }
    
    //                 // console.log(`Using custom object name: ${objectName}`);
    
    //                 conn.describe(objectName, function(err, meta) {
    //                     if (err) {
    //                         console.error("Describe object error:", err);
    //                         return helper.error(res, "An error occurred while describing the custom object.");
    //                     }
                    
    //                     console.log('Custom object fields: ', meta.fields.map(field => field.name));
    //                     // return helper.success(res, "Required field not found on the custom object.",meta.fields.map(field => field.name));
                    
                    
    //                     // const queryFieldObj = meta.fields.find(field => field.name.includes('Data_do_Follow_up__c'));
                    
    //                     // if (!queryFieldObj) {
    //                     //     console.error("Required field not found on the custom object.");
    //                     //     return helper.error(res, "Required field not found on the custom object.");
    //                     // }
                    
    //                     // const queryField = queryFieldObj.name;
    //                     const queryField = "Id,OwnerId,Name,IsDeleted,CreatedDate,CreatedById,N_mero_do_pedido__c,Data_do_Follow_up__c,Notas__c,Data_de_in_cio_do_tratamento_com_Bisaliv__c,Quantas_vezes_ao_dia_utiliza_Bisaliv__c,Qual_dose_em_mg_durante_a_manh__c,Qual_dose_em_mg_durante_a_tarde__c,Qual_dose_em_mg_durante_a_noite__c,Total_dose_em_mg_di_ria__c,Patologia_do_Paciente__c,Qual_foi_o_benef_cio_notado_com_Bisaliv__c,algum_outro_benef_cio__c,Qual_foi_o_de_melhora__c,Notou_algum_efeito_colateral__c,Qual_efeito_colateral__c,Houve_intera_o_medicamentosa__c,Qual_intera_o__c,Medicamentos_em_uso_e_dose_em_mg__c,Order__c,Notou_algum_benef_cio_com_Bisaliv__c,Nome_da_prescri_o__c,O_que_procura_melhorar_com_o_Bisaliv__c,O_tratamento_com_o_Bisaliv_continua__c,Motivo__c,Nome_do_paciente__c,Informe_outro_medicamentos_em_uso__c,Esta_atualmente_em_tratamento_com_o_Bisa__c,Qual_produto__c,Quando_iniciou__c,Quando_parou_de_tomar_Bisaliv__c,Qual_motivo__c,Voc_se_lembra_a_ltima_dose_que_estava__c,Voc_est_em_tratamento_com_algum_produt__c,Qual_a_principal_situa_o_de_sa_de_que_v__c,Qual_o_seusonho__c,Data_de_in_cio_do_tratamento__c,Quantas_vezes_ao_dia_utiliza_o_Bisaliv__c,Qual_Bisaliv_voc_toma__c,Qual_a_dose_di_ria_desse_Bisaliv__c,Voc_toma_um_segundo_Bisaliv_al_m_desse__c,Qual_o_segundo_Bisaliv_que_voc_toma__c,Quandos_jatos_por_dia_voc_usava__c,Voc_toma_um_terceiro_Bisaliv__c,Qual_o_terceiro_Bisaliv_que_voc_toma__c,Qual_a_dose_Bisaliv_que_voc_toma__c,Faz_uso_de_outra_medica_o__c,Qual_foi_o_benef_cio_notado_com_o_Bisali__c,Bisaliv_melhorou_a_sua_sa_de_e_a_sua_qua__c,Obteve_alguma_rea_o_adversa_com_Bisaliv__c,Sobre_o_tratamento_com_Bisalive__c,sugest_es_d_vidas_elogios_ou_depoiment__c,Nome_completo_do_paciente__c,Sua_contribui_o_sempre_muito_importan__c,Qual_o_seu_sonho_que_hoje_voc_n_o_conse__c,Qual_a_quantidade_de_Gummies_di_rias_voc__c,Como_foi_a_sua_experi_ncia_de_compra__c,A_Thronus_foi_capaz_de_tornar_o_seu_proc__c,Qual_o_seu_sonho__c,Por_quanto_tempo_tomou_antes_de_parar__c,Oquelevouasuspensaodo__c,Voc_suspendeu_por_conta_pr_pria__c,Voc_se_lembra_qual_produtos_voc_usava__c,Qual_a_dose_di_ria_desse_Bisali_tomava__c,Voc_usava_um_segundo_Bisaliv__c,Voc_fazia_uso_de_um_terceiro_Bisaliv__c,Voc_gostaria_de_retornar_o_tratamento__c,Qual_a_dose_di_ria_do_segundo_Bisaliv1__c,Qual_o_terceiro_Bisaliv_que_tomava__c,Qual_o_segundo_Bisaliv_que_tomava__c,Qual_a_dose_di_ria__c,Qual_era_a_dose_di_ria_do_terceiro__c,patient_flow__c,Voc_fez_acompanhamento_com_prescritor__c,Receber_feedback_formul_rio__c,Faz_uso_de_outra_medica_o_al_m_do_Bisal__c,De_forma_geral_o_quanto_voc_acredita_qu__c,Fique_vontade_para_deixar_sugest_es_d__c,Email_recebido_do_formul_rio__c,Por_favor_coloque_o_CPF_do_paciente__c,Como_tem_sido_a_sua_experi_ncia_de_compr__c,Obteve_alguma_rea_o_adversa__c,Nome_do_Medico__c,Form_Records__c,Email_do_paciente__c";
                    
    //                     let records = [];
    //                     conn.query(`SELECT ${queryField} FROM ${objectName}`)
    //                         .on("record", function(record) {
    //                             records.push(record);
    //                         })
    //                         .on("end", function() {
    //                             console.log("Total records retrieved: " + records.length);
    //                             return helper.success(res, "Account details fetched successfully", records);
    //                         })
    //                         .on("error", function(queryErr) {
    //                             console.error("Query error:", queryErr);
    //                             return helper.error(res, "An error occurred while fetching account details.");
    //                         })
    //                         .run({ autoFetch: true, maxFetch: 100000 });
    //                 });
    //             } catch (describeErr) {
    //                 console.error("Describe error:", describeErr);
    //                 return helper.error(res, "An error occurred while describing global objects.");
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Unhandled error:", error);
    //         return helper.failed(res, error);
    //     }
    // },
    // slaesforceDataDoctor:async(req,res) => {
    //     try {
    //         var conn = new jsforce.Connection();
    //         conn.login('ajayceo1985@gmail.com', 'Msdjh23xbs@EwxGB4rMORi3dGdnJJjKSGxN4Oh', function(err, res) {
    //             if (err) {
    //                 return console.error('Login error:', err);
    //             }
    //             fetchAllAccounts();
    //         });

    //         function fetchAllAccounts() {
    //             let records = [];
    //         //     let query = conn.query(`
    //         //     SELECT Id, Name, PhotoUrl, CreatedDate, LastModifiedDate, Email_do_consultorio__c, Especialidade__c,Cidade_del__c, Endereco_comercial_Visita__c, Telefone_Consult_rio__c
    //         //     FROM Account 
    //         //     WHERE CreatedDate = 2024-05-29T16:30:22.000+0000
    //         // `); // Account  Contact
    //         let query = conn.query(`
    //             SELECT Id, Name, PhotoUrl, CreatedDate, LastModifiedDate, Email_do_consultorio__c, Especialidade__c,Cidade_del__c, Endereco_comercial_Visita__c, Telefone_Consult_rio__c
    //             FROM Account 
    //         `); // Account  Contact

    //             query
    //                 .on("record", function(record) {
    //                     records.push(record);
    //                 })
    //                 .on("end",async function() {
    //                     // if(records.length > 0){
    //                     //     for(let allRecords of records){
    //                     //         await users.create({
    //                     //             role : 3,
    //                     //             firstName : allRecords.Name,
    //                     //             email : allRecords.Email_do_consultorio__c,
    //                     //             phoneNumber : allRecords.Telefone_Consult_rio__c,
    //                     //             doctorId : allRecords.Id,
    //                     //             address : allRecords.Endereco_comercial_Visita__c,
    //                     //             city : allRecords.Cidade_del__c,
    //                     //             image : allRecords.PhotoUrl,
    //                     //             categoryName : allRecords.Especialidade__c,
    //                     //         });
    //                     //     }
    //                     // }
    //                     return helper.success(res, "Account details fetched successfully", records);
    //                 })
    //                 .on("error", function(err) {
    //                     console.error("Query error:", err);
    //                     return helper.error(res, "An error occurred while fetching account details.");
    //                 })
    //                 .run({ autoFetch: true, maxFetch: 100000 }); // Adjust maxFetch if needed
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return helper.failed(res, error);
    //     }
    // },
    // slaesforceData1: async (req, res) => {
    //     try {
    //         var jsforce = require('jsforce');
    //         var conn = new jsforce.Connection();
    //         conn.login('ajayceo1985@gmail.com', 'Msdjh23xbs@EwxGB4rMORi3dGdnJJjKSGxN4Oh', function(err, res) {
    //         if (err) { return console.error(err,"====>"); }
    //             conn.query('SELECT Id, Name FROM Account', function(err, res) {
    //                 if (err) { return console.error(err); }
    //                 console.log(res.records[0],">>>>>>>>>clg>>>>>");
    //                 conn.request(res.records[0].attributes.url, function(err, accountDetails) {
    //                     if (err) {
    //                       return console.error(err);
    //                     }
                  
    //                     console.log('Account Details:', accountDetails);
    //                     // return helper.success(res, "Account details fetched successfully", accountDetails);
    //                   });
    //             });
    //         });
    //         // return helper.success(res, "get profile successfully", data)
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
}








