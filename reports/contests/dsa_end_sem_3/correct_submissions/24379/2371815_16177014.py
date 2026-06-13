# Your code here
n=int(input())
l=list(map(int,input().split()))
st=[]
for i in l:
    if(len(st)==0 or i>=0):
        st.append(i)
    elif(i<0):
        if(st[-1]==(-1*i)):
            st.pop()
        elif(st[-1]>(-1*i)):
            continue
        elif(st[-1]<0):
            st.append(i)
        else:
            while(len(st)>0 and st[-1]<(-1*i) and st[-1]>0):
                st.pop()
            if(len(st)>0 and st[-1]<0):
                st.append(i)
            if(len(st)==0):
                st.append(i)
print(*st)