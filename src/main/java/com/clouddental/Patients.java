package com.clouddental;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.users.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.inject.Named;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

/**
 * Defines v1 of a patientsCRUD API.
 */
@Api(
    name = "patientsCRUD",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
@Entity
public class Patients {
    @Id public Long id;
 //   public static ArrayList<Patient> patients = new ArrayList<>();
/*    public static ArrayList<PrintPatient> patients = new ArrayList<>();

    static {
        patients.add(new PrintPatient("Edu"));
        patients.add(new PrintPatient("Tino"));
        patients.add(new PrintPatient("Alber"));
    }*/

    public Patient createPatient(@Named("name") String name) {
        Patient p = new Patient(name);

        ObjectifyService.ofy().save().entity(p).now();
        //patients.add(p);
        return p;
    }

/*    public Patient getPatient(@Named("id") Integer id) throws NotFoundException {
        try {
            return patients.get(id);
        } catch (IndexOutOfBoundsException e) {
            throw new NotFoundException("Patients not found with an index: " + id);
        }
    }*/

    public Patient getPatient(@Named("name") String name) {
       // return ObjectifyService.ofy().load().type(Patient.class).id(5066549580791808L).now();
        return ObjectifyService.ofy().load().type(Patient.class).filter("name", name).first().now();

    }

    public List<Patient> listPatients() {
        return ObjectifyService.ofy()
                .load()
                .type(Patient.class)
                //.ancestor(Objects)
               // .order("-creationDate")
               // .limit(5)
                .list();
    }
}