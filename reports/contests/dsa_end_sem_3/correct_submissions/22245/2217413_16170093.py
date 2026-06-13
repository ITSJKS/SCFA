t = int(input())
for _ in range(t):
    # Write your code here
    a,b=map(int,input().split())
    li=list(map(int,input().split()))
    triplet="NO"
    for i in range(a):
        for j in range(i+1,a):
            for k in range(j+1,a):
                if li[i]+li[j]+li[k]==b:
                    triplet="YES"
    print(triplet)