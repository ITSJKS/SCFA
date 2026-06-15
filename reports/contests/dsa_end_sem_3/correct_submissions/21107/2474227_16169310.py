# Your code here
l,r = map(int,input().split())
add=0
for i in range(l,r+1):
    if i%2==1:
        print(i,end=" ")