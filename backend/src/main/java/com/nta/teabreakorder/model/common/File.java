package com.nta.teabreakorder.model.common;

import com.nta.teabreakorder.config.AuditingModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "files")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class File extends AuditingModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private long size;

    @Column(name = "content_type")
    private String contentType;

    private String url;

}
