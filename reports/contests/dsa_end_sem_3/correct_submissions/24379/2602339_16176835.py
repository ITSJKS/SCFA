n=int(input())
l=list(map(int,input().split()))
st=[]
i=0
while i<n:
    # print(st)
    if st==[]:
        st.append(l[i])
        i+=1
    else:
        if (st[-1]>0 and l[i]>0) or (st[-1]<0 and l[i]<0):
            st.append(l[i])
            i+=1
        else:
            if abs(l[i])>abs(st[-1]):
                st.pop()
                
                
            elif abs(l[i])==abs(st[-1]):
                st.pop()
                i+=1
            else:
                i+=1

print(*st)