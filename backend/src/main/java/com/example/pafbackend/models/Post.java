package com.example.pafbackend.models;




package com.example.pafbackend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;






import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Getter
@Setter
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private Date timestamp;
    private String contentDescription;
    private String mediaLink;
    private String mediaType;
}


