# build aliyun-cli (aliyun)
FROM golang:alpine as builder
RUN apk add --update make git; \
    git clone --recurse-submodules \
    https://github.com/aliyun/aliyun-cli.git \
    /go/src/github.com/aliyun/aliyun-cli;
WORKDIR /go/src/github.com/aliyun/aliyun-cli
RUN make deps; \
    make testdeps; \
    make build;

# build aliyun image from alpine
FROM alpine
COPY --from=builder /go/src/github.com/aliyun/aliyun-cli/out/aliyun /usr/local/bin
ENTRYPOINT ["aliyun"]