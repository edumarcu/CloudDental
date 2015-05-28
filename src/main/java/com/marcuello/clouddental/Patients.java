package com.marcuello.clouddental;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.users.User;

import java.util.ArrayList;

import javax.inject.Named;

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
public class Patients {

    public static ArrayList<HelloGreeting> patients = new ArrayList<HelloGreeting>();

    static {
        patients.add(new HelloGreeting("Edu"));
        patients.add(new HelloGreeting("Tino"));
        patients.add(new HelloGreeting("Alber"));
    }

    public HelloGreeting getGreeting(@Named("id") Integer id) throws NotFoundException {
        try {
            return patients.get(id);
        } catch (IndexOutOfBoundsException e) {
            throw new NotFoundException("Greeting not found with an index: " + id);
        }
    }

    public ArrayList<HelloGreeting> listGreeting() {
        return patients;
    }
}
