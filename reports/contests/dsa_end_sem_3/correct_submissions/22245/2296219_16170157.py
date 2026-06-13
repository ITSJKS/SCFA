t = int(input())
for _ in range(t):
    # Write your code here
    a,b=map(int,input().split())
    l=list(map(int,input().split()))
    l.sort()
    def hello():
        for i in range(a-2):
            for j in range(i+1,a-1):
                for k in range(j+1,a):
                    if l[i]+l[j]+l[k]==b:
                        return("YES")
                        
        return "NO"
    print(hello())