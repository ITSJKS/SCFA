# Your code here
l , r = list(map(int,input().split()))
li = []
for i in range(l , r + 1):
    if i % 2 != 0:
        print(i , end = " ")